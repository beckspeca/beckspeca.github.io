---
title: '#데이터분석 Ⅵ Feature Engineering에서 LLM의 활용 방법'
description: 'LLM으로 피처 후보와 구현 코드를 만들고 타깃 누수, 교차 검증, Ablation Test를 통해 안전하게 검증하는 방법을 정리합니다.'
pubDate: '2026-07-25'
updatedDate: '2026-08-19'
tags: ['AI', 'ML', 'LLM', 'Feature Engineering', 'Python', 'Pandas']
---

머신러닝 프로젝트를 진행하다 보면 모델을 선택하는 것보다 더 어렵게 느껴지는 단계가 있다.

바로 **Feature Engineering**, 즉 **피처 엔지니어링**이다.

같은 데이터를 사용하더라도 어떤 피처를 모델에 입력하느냐에 따라 모델의 성능은 크게 달라질 수 있다. 원본 데이터를 그대로 사용하는 것보다 문제와 관련된 새로운 피처를 만들어 주면 모델이 데이터에 숨어 있는 패턴을 더 쉽게 학습할 수 있기 때문이다.

하지만 좋은 피처를 만드는 것은 쉽지 않다. 데이터의 의미를 이해해야 하고, 변수 사이의 관계를 분석해야 하며, 해결하려는 문제에 대한 도메인 지식도 필요하다.

그렇다면 ChatGPT, Claude와 같은 대규모 언어 모델인 **LLM**에게 피처 엔지니어링을 맡길 수 있을까?

## 1. 피처 엔지니어링이란?

피처는 머신러닝 모델이 학습에 사용하는 입력 변수를 의미한다.

예를 들어 건강 상태를 예측하는 데이터에 다음과 같은 변수가 있다고 가정해 보자.

```text
sleep_duration: 하루 평균 수면 시간
step_count: 하루 평균 걸음 수
exercise_duration: 하루 평균 운동 시간
calorie_expenditure: 하루 평균 칼로리 소비량
water_intake: 하루 평균 수분 섭취량
heart_rate: 평균 심박수
bmi: 체질량지수
stress_level: 스트레스 수준
sleep_quality: 수면 품질
```

이 변수들을 그대로 모델에 입력할 수도 있지만 변수 사이의 관계를 이용해 새로운 정보를 만들 수도 있다.

```text
calorie_per_step
exercise_load
sleep_deprivation_flag
water_calorie_ratio
stress_sleep_interaction
```

이처럼 기존 데이터를 변환하거나 조합해 모델이 학습하기 좋은 형태로 만드는 과정을 **피처 엔지니어링**이라고 한다.

대표적인 방법은 다음과 같다.

- 여러 변수를 결합해 새로운 변수 생성
- 연속형 데이터를 구간별 범주로 변환
- 범주형 데이터 인코딩
- 로그 변환 및 스케일링
- 날짜 데이터에서 연도, 월, 요일 추출
- 중요도가 낮거나 중복된 변수 제거
- 결측 여부를 새로운 변수로 생성

> 피처 엔지니어링은 현실의 문제를 머신러닝 모델이 이해할 수 있는 숫자로 표현하는 과정이다.

## 2. LLM을 활용할 수 있는 이유

LLM은 다양한 문서, 코드, 데이터 분석 사례를 학습했다. 데이터의 컬럼 이름과 설명을 제공하면 각 변수의 의미를 해석하고, 변수 사이에서 만들 수 있는 새로운 조합을 제안할 수 있다.

예를 들어 다음처럼 질문할 수 있다.

```text
다음은 건강 상태 분류 데이터의 컬럼이다.

- sleep_duration: 하루 평균 수면 시간
- step_count: 하루 평균 걸음 수
- exercise_duration: 하루 평균 운동 시간
- calorie_expenditure: 하루 평균 칼로리 소비량
- water_intake: 하루 평균 수분 섭취량
- stress_level: 스트레스 수준
- sleep_quality: 수면 품질
- bmi: 체질량지수

건강 상태를 분류하는 모델에 사용할 새로운 피처를 제안해줘.

각 피처에 대해 다음 내용을 설명해줘.
1. 피처 이름
2. 계산 방법
3. 피처의 의미
4. 기대 효과
5. 발생할 수 있는 문제점
```

LLM은 다음과 같은 피처를 제안할 수 있다.

| 새로운 피처 | 계산 아이디어 | 의미 |
| --- | --- | --- |
| `calorie_per_step` | 칼로리 소비량 ÷ 걸음 수 | 활동 대비 에너지 소비량 |
| `exercise_load` | 운동 시간 × 활동 강도 | 전체적인 운동 부하 |
| `sleep_deprivation_flag` | 수면 시간이 기준보다 짧은지 표시 | 수면 부족 여부 |
| `water_calorie_ratio` | 수분 섭취량 ÷ 칼로리 소비량 | 활동량 대비 수분 섭취 수준 |
| `stress_sleep_interaction` | 스트레스 수준 × 수면 품질 | 스트레스와 수면의 복합적인 영향 |
| `bmi_category` | BMI를 여러 구간으로 구분 | BMI 수치의 범주화 |

하지만 LLM이 제안한 피처는 정답이 아니다. LLM은 데이터 분석가가 검토할 수 있는 **피처 후보를 빠르게 생성하는 역할**을 한다.

## 3. LLM이 제안한 피처를 Python으로 구현하기

LLM은 피처 아이디어뿐 아니라 실제 Python 코드도 작성할 수 있다.

```python
import numpy as np
import pandas as pd


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()

    # 걸음 수 1회당 칼로리 소비량
    result["calorie_per_step"] = (
        result["calorie_expenditure"]
        / result["step_count"].replace(0, np.nan)
    )

    # 운동 시간 1분당 걸음 수
    result["steps_per_exercise_minute"] = (
        result["step_count"]
        / result["exercise_duration"].replace(0, np.nan)
    )

    # 칼로리 소비량 대비 수분 섭취량
    result["water_calorie_ratio"] = (
        result["water_intake"]
        / result["calorie_expenditure"].replace(0, np.nan)
    )

    # 수면 부족 여부
    result["sleep_deprivation_flag"] = (
        result["sleep_duration"] < 7
    ).astype(int)

    # 스트레스와 수면 품질의 상호작용
    result["stress_sleep_interaction"] = (
        result["stress_level"]
        * result["sleep_quality"]
    )

    # BMI 범주화
    result["bmi_category"] = pd.cut(
        result["bmi"],
        bins=[0, 18.5, 25, 30, np.inf],
        labels=[
            "underweight",
            "normal",
            "overweight",
            "obese"
        ]
    )

    return result
```

LLM을 활용하면 피처 아이디어를 실제 코드로 옮기는 시간을 줄일 수 있다. 그러나 코드가 오류 없이 실행된다고 해서 좋은 피처라는 뜻은 아니다.

예를 들어 걸음 수가 `0`인 데이터가 존재하면 0으로 나누는 문제가 발생한다. 걸음 수가 매우 작다면 지나치게 큰 값이 만들어질 수도 있다.

```python
result["calorie_per_step"] = (
    result["calorie_expenditure"]
    / result["step_count"].replace(0, np.nan)
)
```

따라서 LLM이 만든 코드는 반드시 데이터 분석가가 검토해야 한다.

## 4. 좋은 피처를 제안받는 프롬프트

LLM의 답변 품질은 프롬프트의 구체성에 따라 크게 달라진다.

```text
피처 엔지니어링 해줘.
```

이처럼 짧게 질문하면 결과가 추상적으로 나올 가능성이 높다. 분석 목적, 타깃 변수, 컬럼의 의미와 제약 조건을 함께 제공해야 한다.

```text
너는 분류 문제를 수행하는 데이터 분석가다.

목표:
사용자의 건강 상태를 fit, at-risk, unhealthy로 분류한다.

타깃 변수:
health_condition

입력 변수:
- sleep_duration: 평균 수면 시간
- heart_rate: 평균 심박수
- bmi: 체질량지수
- step_count: 하루 평균 걸음 수
- exercise_duration: 평균 운동 시간
- water_intake: 평균 수분 섭취량
- stress_level: 스트레스 수준
- sleep_quality: 수면 품질

요청 사항:
1. 새롭게 만들 수 있는 피처를 10개 제안한다.
2. 각 피처의 계산식을 작성한다.
3. 해당 피처가 유용할 수 있는 이유를 설명한다.
4. 타깃 누수 가능성을 평가한다.
5. 결측값과 0으로 나누는 문제를 설명한다.
6. pandas 코드로 구현한다.
7. 근거가 약한 피처는 별도로 표시한다.

출력 형식:
피처명 | 계산식 | 기대 효과 | 위험 요소 | 검증 방법
```

프롬프트에는 다음 정보를 포함하는 것이 좋다.

- 분석 문제의 목적
- 회귀 또는 분류 여부
- 타깃 변수
- 각 컬럼의 의미와 자료형
- 결측치 존재 여부
- 데이터 수집 시점
- 피처 생성 시 지켜야 할 조건
- 원하는 출력 형식
- 타깃 누수 검토 요청

## 5. LLM이 만든 피처의 검증 방법

LLM이 제안한 피처는 어디까지나 하나의 가설이다. 실제로 도움이 되는지는 모델을 학습시켜 확인해야 한다.

```text
기준 모델 생성
→ 새로운 피처 추가
→ 동일한 조건으로 재학습
→ 평가 지표 비교
→ 개별 피처 효과 분석
```

## 6. 원본 피처로 기준 모델 만들기

먼저 원본 피처만 사용한 기준 모델을 학습한다.

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import balanced_accuracy_score
from sklearn.model_selection import train_test_split


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

pred = model.predict(X_test)

baseline_score = balanced_accuracy_score(
    y_test,
    pred
)

print("기준 성능:", baseline_score)
```

`stratify=y`를 사용하면 학습 데이터와 테스트 데이터의 클래스 비율을 비슷하게 유지할 수 있다.

특히 클래스가 불균형한 분류 문제에서는 단순 정확도보다 다음 지표를 함께 확인하는 것이 좋다.

- Balanced Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix
- ROC-AUC

## 7. 새로운 피처 추가하기

LLM이 제안한 피처를 추가한다.

```python
X_featured = create_features(X)
```

새롭게 생성한 `bmi_category`와 같은 범주형 변수는 모델에 입력하기 전에 인코딩해야 한다.

```python
X_featured = pd.get_dummies(
    X_featured,
    columns=["bmi_category"],
    drop_first=True
)
```

이후 기준 모델과 동일한 조건으로 학습한다.

```python
X_train, X_test, y_train, y_test = train_test_split(
    X_featured,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

pred = model.predict(X_test)

featured_score = balanced_accuracy_score(
    y_test,
    pred
)

print("피처 추가 전:", baseline_score)
print("피처 추가 후:", featured_score)
```

예를 들어 다음과 같은 결과가 나올 수 있다.

```text
피처 추가 전: 0.912
피처 추가 후: 0.926
```

새로운 피처를 추가한 뒤 성능이 향상됐다면 피처 엔지니어링이 효과가 있었다고 볼 수 있다. 하지만 모든 피처가 성능 향상에 기여했다고 단정할 수는 없다.

## 8. Ablation Test로 피처 효과 확인하기

여러 개의 파생 피처를 한 번에 추가하면 어떤 피처가 실제로 도움이 됐는지 알기 어렵다. 이때 사용할 수 있는 방법이 **Ablation Test**다.

Ablation Test는 피처를 하나씩 추가하거나 제거하면서 성능 변화를 확인하는 실험이다.

| 실험 | 추가된 피처 | Balanced Accuracy |
| --- | --- | ---: |
| Base | 원본 피처 | 0.912 |
| V1 | `calorie_per_step` | 0.914 |
| V2 | `sleep_deprivation_flag` | 0.919 |
| V3 | `stress_sleep_interaction` | 0.925 |
| V4 | 전체 파생 피처 | 0.926 |

위 결과에서는 `stress_sleep_interaction`을 추가했을 때 성능이 상대적으로 크게 향상된 것을 확인할 수 있다. 반면 일부 피처는 성능 향상에 거의 기여하지 못할 수도 있다.

> 피처 수가 증가한다고 해서 모델 성능이 항상 증가하는 것은 아니다.

불필요한 피처는 다음과 같은 문제를 만들 수 있다.

- 데이터에 잡음 추가
- 모델 복잡도 증가
- 과적합 가능성 증가
- 학습 시간 증가
- 해석 가능성 저하
- 다중공선성 증가

따라서 새로운 피처는 하나씩 검증하는 것이 좋다.

## 9. 교차 검증으로 성능 확인하기

한 번의 데이터 분할 결과만으로 피처의 효과를 판단하면 우연에 의한 결과일 수 있다. 따라서 교차 검증을 사용하는 것이 좋다.

```python
from sklearn.model_selection import StratifiedKFold
from sklearn.model_selection import cross_val_score


cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

scores = cross_val_score(
    model,
    X_featured,
    y,
    cv=cv,
    scoring="balanced_accuracy"
)

print("교차 검증 점수:", scores)
print("평균 점수:", scores.mean())
print("표준편차:", scores.std())
```

평균 성능뿐만 아니라 표준편차도 함께 확인해야 한다. 평균 성능이 높아도 분할마다 점수 차이가 크다면 안정적인 피처라고 보기 어렵다.

## 10. 반드시 확인해야 하는 타깃 누수

LLM에게 피처 엔지니어링을 맡길 때 가장 위험한 문제 중 하나는 **Target Leakage**, 즉 타깃 누수다.

타깃 누수는 예측 시점에 알 수 없는 정보가 입력 피처에 포함되는 문제다. 예를 들어 고객 이탈을 예측한다고 가정해 보자.

```text
target: churn
feature: cancellation_date
```

`cancellation_date`는 고객이 이미 서비스를 해지한 후에 생성되는 정보다. 이 변수를 사용하면 모델의 성능은 매우 높게 나올 수 있지만 고객이 이탈하기 전에 예측하는 용도로는 사용할 수 없다.

건강 상태 분류에서도 다음 변수가 최종 건강 상태가 결정된 이후에 만들어진 정보라면 입력 피처로 사용해서는 안 된다.

```text
doctor_diagnosis
final_health_grade
treatment_result
```

LLM은 컬럼 이름만 보고 데이터가 실제로 언제 생성됐는지 정확히 알 수 없다. 따라서 프롬프트에 다음 조건을 추가하는 것이 좋다.

```text
각 피처가 실제 예측 시점에 사용할 수 있는 정보인지 확인해줘.

타깃이 결정된 이후에 생성되는 정보는 피처에서 제외하고,
타깃 누수 가능성이 있는 피처는 별도로 표시해줘.
```

하지만 최종 판단은 데이터 분석가가 직접 내려야 한다.

## 11. 데이터 분할 이후에 피처를 만들어야 하는 이유

피처 엔지니어링 과정에서도 데이터 누수가 발생할 수 있다.

예를 들어 전체 데이터의 평균을 사용해 결측치를 채운 뒤 데이터를 분할하면 테스트 데이터의 정보가 학습 데이터에 포함될 수 있다.

```text
잘못된 순서
전체 데이터에서 평균 계산
→ 결측치 대체
→ 학습 데이터와 테스트 데이터 분할

권장되는 순서
학습 데이터와 테스트 데이터 분할
→ 학습 데이터에서 평균 계산
→ 학습 데이터와 테스트 데이터에 동일한 값 적용
```

이 문제를 방지하려면 `Pipeline`을 사용하는 것이 좋다.

```python
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


numeric_columns = [
    "sleep_duration",
    "heart_rate",
    "bmi",
    "step_count",
    "exercise_duration",
    "water_intake"
]

categorical_columns = [
    "stress_level",
    "sleep_quality"
]

numeric_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median"))
    ]
)

categorical_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="most_frequent")
        ),
        (
            "encoder",
            OneHotEncoder(handle_unknown="ignore")
        )
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        ("numeric", numeric_pipeline, numeric_columns),
        ("categorical", categorical_pipeline, categorical_columns)
    ]
)

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "model",
            RandomForestClassifier(random_state=42)
        )
    ]
)
```

## 12. LLM이 잘하는 피처 엔지니어링 작업

LLM은 다음과 같은 작업에서 유용하게 활용할 수 있다.

### 12.1 피처 후보 생성

사람이 바로 떠올리지 못한 변수 조합을 빠르게 제안할 수 있다.

```text
sleep_duration + sleep_quality
stress_level × sleep_quality
calorie_expenditure ÷ step_count
water_intake ÷ calorie_expenditure
```

### 12.2 구현 코드 작성

다음과 같은 반복적인 전처리 코드를 빠르게 작성할 수 있다.

- 비율 피처 생성
- 날짜 정보 분해
- 범주형 변수 인코딩
- 연속형 변수 구간화
- 로그 변환
- 이상치 처리
- 결측치 처리

### 12.3 도메인 가설 정리

어떤 변수 조합이 타깃과 관련될 수 있는지 가설을 구조적으로 정리할 수 있다.

### 12.4 실험 코드 자동화

여러 피처 조합을 반복적으로 생성하고 평가하는 코드를 작성할 수 있다.

### 12.5 결과 문서화

생성한 피처의 의미, 계산식, 기대 효과, 검증 결과를 표와 문장으로 정리할 수 있다.

## 13. LLM이 잘하지 못하는 부분

LLM에게 모든 과정을 그대로 맡기는 것은 위험하다.

### 13.1 데이터 수집 과정을 알 수 없다

LLM은 컬럼이 언제, 어떤 방식으로 측정됐는지 알 수 없다. 따라서 타깃 누수 여부를 완벽하게 판단하기 어렵다.

### 13.2 통계적 유효성을 보장하지 않는다

그럴듯한 피처를 제안할 수는 있지만 실제 성능 향상을 보장하지는 않는다.

### 13.3 인과관계를 증명하지 못한다

두 변수가 관련돼 보이더라도 그것이 인과관계라는 뜻은 아니다.

### 13.4 도메인 기준을 잘못 적용할 수 있다

산업, 국가, 연령대, 측정 방식에 따라 기준이 달라질 수 있다. LLM이 일반적인 기준을 현재 데이터에 잘못 적용할 가능성이 있다.

### 13.5 실행 가능한 코드와 올바른 코드는 다르다

코드가 오류 없이 실행되더라도 분석 논리가 잘못됐을 수 있다.

### 13.6 존재하지 않는 컬럼을 사용할 수 있다

LLM이 데이터에 없는 컬럼이나 계산할 수 없는 값을 가정할 수 있다.

## 14. LLM 피처 제안 검토 체크리스트

LLM이 새로운 피처를 제안했다면 다음 항목을 확인해야 한다.

### 데이터 관점

- 해당 피처를 실제 데이터로 계산할 수 있는가?
- 결측값은 어떻게 처리할 것인가?
- 0으로 나누는 문제가 발생하지 않는가?
- 지나치게 큰 값이나 작은 값이 만들어지지 않는가?
- 이상치에 민감하지 않은가?
- 기존 피처와 지나치게 중복되지 않는가?

### 모델링 관점

- 모델 성능이 실제로 향상됐는가?
- 교차 검증에서도 효과가 유지되는가?
- 과적합이 증가하지 않았는가?
- 특정 클래스의 성능만 높아진 것은 아닌가?
- 모델 해석이 지나치게 어려워지지 않았는가?

### 비즈니스 관점

- 실제 예측 시점에 사용할 수 있는 정보인가?
- 타깃 누수 가능성은 없는가?
- 도메인 관점에서 의미가 있는가?
- 실제 서비스 환경에서도 계산할 수 있는가?
- 생성 비용보다 얻는 효과가 큰가?

## 15. 가장 현실적인 LLM 활용 방법

LLM이 피처 엔지니어링을 완전히 대신한다고 보기는 어렵다. 가장 현실적인 방식은 LLM과 데이터 분석가가 역할을 나누는 것이다.

```text
데이터 분석가
문제 정의 및 데이터 이해
        ↓
LLM
피처 후보와 구현 코드 제안
        ↓
데이터 분석가
도메인 타당성 및 타깃 누수 검토
        ↓
모델 실험
교차 검증 및 Ablation Test
        ↓
데이터 분석가
최종 피처 선택
```

LLM은 피처 엔지니어링의 최종 의사결정자가 아니다.

> LLM은 피처 아이디어 생성기이자 코딩 보조 도구에 더 가깝다.

## 16. 마무리

피처 엔지니어링은 데이터 분석가의 경험과 도메인 지식이 크게 작용하는 영역이다.

LLM은 데이터의 컬럼과 설명을 바탕으로 새로운 피처 후보를 빠르게 제안하고, 이를 Python 코드로 구현하는 데 도움을 줄 수 있다. 하지만 LLM이 제안한 피처가 실제로 유용한지는 별개의 문제다.

반드시 다음과 같은 검증 과정을 거쳐야 한다.

```text
피처 제안
→ 코드 구현
→ 데이터 누수 확인
→ 교차 검증
→ Ablation Test
→ 최종 피처 선택
```

결국 중요한 것은 LLM이 좋은 피처를 만들어 주는가가 아니다.

> LLM이 제안한 피처를 데이터 분석가가 얼마나 정확하게 검증할 수 있는가가 더 중요하다.

LLM은 피처 엔지니어링을 대신하는 도구가 아니다. 분석가가 더 많은 가설을 빠르게 만들고 실험할 수 있도록 도와주는 도구라고 볼 수 있다.

추가로 많은 부분에서 LLM을 활용할 수 있지만, 같은 내용으로 프로토타입을 빠르고 간단하게 만드는 용도로 특히 유용하다고 생각한다.
