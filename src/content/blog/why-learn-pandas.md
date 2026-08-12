---
title: '#데이터분석 Ⅰ Pandas | 첫 번째 도구'
description: '표 형태의 데이터를 다루는 Pandas가 필요한 이유와 Series, DataFrame의 기본 구조를 알아봅니다.'
pubDate: '2026-07-08'
updatedDate: '2026-08-13'
tags: ['AI', 'ML', 'DA', 'DS', 'NumPy', 'Pandas']
---

## 왜 Pandas를 배워야 할까?

이어드림 스쿨 6기를 시작하고 데이터 분석을 배우면서 가장 먼저 마주친 것은 복잡한 수식이나 머신러닝 모델이 아니라 대부분 표 형태의 데이터였다. 예를 들면 다음과 같다.

- `chinook.db`
- `books.db`
- `titanic.db`

이 데이터는 모두 행과 열로 이루어진 구조를 가진다.

이런 데이터를 Python에서 편하게 불러오고, 확인하고, 수정하고, 요약하기 위해 사용하는 대표적인 라이브러리가 바로 **Pandas**다.

## 1. Pandas 사용 방법

Pandas는 Python에서 데이터를 다루기 위한 라이브러리다. 쉽게 말하면 엑셀처럼 생긴 데이터를 코드로 다룰 수 있게 해주는 도구라고 볼 수 있다.

엑셀에서는 마우스로 필터를 걸고 평균을 구하거나 필요한 열만 선택한다. Pandas에서는 이런 작업을 코드로 처리한다.

![표 형태의 데이터를 Pandas로 다루는 모습](https://velog.velcdn.com/images/backspace/post/079802c9-0bad-4b08-b921-2c9a56c9f2d4/image.png)

Pandas는 일반적으로 다음과 같이 불러온다.

```python
import pandas as pd
```

## 2. Pandas가 필요한 이유

데이터 분석 과정은 보통 다음 흐름으로 진행된다.

```text
데이터 불러오기 → 데이터 확인 → 데이터 정리 → 데이터 변환 → 데이터 요약 → 분석·시각화
```

Pandas는 가장 가공되지 않은 데이터인 **원시 데이터(Raw Data)**를 편집하고 분석하기 좋은 형태로 만드는 도구인 셈이다.

## 3. Pandas의 기본 구조

Pandas를 이해하려면 두 가지 개념을 먼저 알아야 한다.

### Series

Series는 1차원 데이터다. 쉽게 말하면 표에서 하나의 열과 비슷하다고 생각하면 된다.

```python
import pandas as pd

age = pd.Series([20, 21, 22, 23])
print(age)
```

실행 결과는 다음과 같다.

```text
0    20
1    21
2    22
3    23
dtype: int64
```

각 나이 값과 함께 순서를 나타내는 인덱스가 출력된다.

### DataFrame

DataFrame은 여러 개의 Series가 모여 만들어진 2차원 구조다.

```python
df = pd.DataFrame({
    "name": ["민수", "지영", "철수"],
    "age": [21, 22, 20],
    "score": [85, 90, 78]
})

print(df)
```

실행 결과는 다음과 같다.

```text
  name  age  score
0   민수   21     85
1   지영   22     90
2   철수   20     78
```

이처럼 이름, 나이, 점수 등을 함께 가져오는 2차원의 복합 데이터다.

## 4. Pandas를 배운다는 것의 의미

Pandas를 배운다는 것은 단순히 함수 이름을 외우는 것이 아니다.

데이터와 소통하는 하나의 새로운 언어를 배우는 일이다. 언어를 배운다는 것은 새로운 세계를 볼 수 있는 수단을 얻는 것이기 때문에, 데이터와 원활하게 소통하려면 가장 기본적인 Pandas부터 탄탄하게 배워야 한다.

[Pandas 공부 자료](https://wikidocs.net/180834)
