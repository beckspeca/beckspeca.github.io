---
title: '#데이터분석 Ⅱ Pandas | 데이터 분석의 시작 문법'
description: 'Pandas DataFrame을 만들고 불러온 뒤 head, shape, columns, info, describe로 데이터 구조를 확인하는 기본 문법을 정리합니다.'
pubDate: '2026-07-09'
updatedDate: '2026-08-13'
tags: ['AI', 'ML', 'DA', 'DS', 'NumPy', 'Pandas']
---

지난 글에서는 Pandas가 무엇인지, 그리고 왜 데이터 분석에서 자주 사용되는지 정리했다. 이번 글에서는 Pandas를 실제로 사용하기 위한 첫 번째 문법인 **DataFrame 생성과 데이터 확인 문법**을 정리한다.

데이터 분석은 대체로 다음 순서로 시작한다.

```text
데이터 불러오기 → 구조 확인 → 데이터 정제 → 탐색과 분석
```

분석에 앞서 데이터를 정확히 불러오고 구조를 이해해야 한다. 컬럼의 의미나 데이터 타입을 확인하지 않은 채 분석하면 잘못된 결과를 얻을 수 있기 때문이다.

## 1. 직접 DataFrame 만들기

DataFrame은 행과 열로 이루어진 Pandas의 2차원 자료구조다. 먼저 Python 딕셔너리를 이용해 작은 DataFrame을 만들어보자.

```python
import pandas as pd

data = {
    "name": ["Kim", "Lee", "Park"],
    "age": [25, 30, 28],
    "city": ["Seoul", "Busan", "Incheon"]
}

df = pd.DataFrame(data)
print(df)
```

실행 결과는 다음과 같다.

```text
   name  age     city
0   Kim   25    Seoul
1   Lee   30    Busan
2  Park   28  Incheon
```

`pd.DataFrame(data)`는 딕셔너리나 리스트 같은 Python 데이터를 표 형태로 변환한다. `df`는 DataFrame을 저장한 변수 이름이다. 필수 이름은 아니지만 데이터 분석 예제에서 관례적으로 자주 사용한다.

파일에 저장된 데이터를 불러올 수도 있다. CSV 파일은 `read_csv()`를 사용한다.

```python
df = pd.read_csv("data.csv")
```

`pd.DataFrame()`과 `pd.read_csv()`의 역할은 다르다.

- `pd.DataFrame(data)`: 메모리에 있는 Python 객체를 DataFrame으로 변환
- `pd.read_csv("data.csv")`: CSV 파일을 읽어 DataFrame 생성

## 2. 데이터 앞부분과 뒷부분 확인하기

데이터를 불러온 직후에는 일부 행을 먼저 확인하는 것이 좋다. 컬럼과 값이 예상한 형태인지 빠르게 파악할 수 있다.

### `head()`

`head()`는 DataFrame의 앞부분을 보여준다. 기본값은 5개 행이다.

```python
df.head()
```

확인할 행의 개수를 직접 지정할 수도 있다.

```python
df.head(10)
```

### `tail()`

`tail()`은 DataFrame의 마지막 부분을 보여준다.

```python
df.tail()
```

시계열처럼 정렬 순서가 중요한 데이터라면 `head()`와 `tail()`을 함께 확인하는 것이 유용하다.

## 3. 행과 열 개수 확인하기

`shape`를 사용하면 DataFrame의 크기를 확인할 수 있다.

```python
df.shape
```

결과가 `(1000, 8)`이라면 1,000개 행과 8개 열이 있다는 뜻이다.

```text
(행 개수, 열 개수)
```

`shape` 뒤에는 괄호를 붙이지 않는다.

```python
# 잘못된 사용
df.shape()

# 올바른 사용
df.shape
```

`shape`은 동작을 수행하는 메서드가 아니라 DataFrame이 가진 정보를 나타내는 **속성**이기 때문이다.

## 4. 컬럼과 데이터 타입 확인하기

### `columns`

`columns`는 전체 컬럼명을 보여준다.

```python
df.columns
```

컬럼명에 공백이 있거나 예상하지 못한 이름이 들어왔는지 확인할 때 유용하다.

### `info()`

`info()`는 행 수, 컬럼명, 결측치가 아닌 값의 개수와 데이터 타입을 요약한다.

```python
df.info()
```

특히 다음 항목을 살펴보는 것이 좋다.

- 숫자가 문자열 타입으로 들어오지 않았는가?
- 날짜가 단순 문자열로 저장되지 않았는가?
- 결측치가 존재하는 컬럼은 무엇인가?
- 예상보다 메모리를 많이 사용하지 않는가?

`shape`으로 전체 크기를 확인하고 `info()`의 non-null 개수와 비교하면 결측치의 존재 여부를 빠르게 짐작할 수 있다.

## 5. 기초 통계 확인하기

`describe()`는 숫자형 컬럼의 기초 통계를 요약한다.

```python
df.describe()
```

기본적으로 다음 정보를 제공한다.

| 항목 | 의미 |
| --- | --- |
| `count` | 결측치를 제외한 값의 개수 |
| `mean` | 평균 |
| `std` | 표준편차 |
| `min` | 최솟값 |
| `25%` | 제1사분위수 |
| `50%` | 중앙값 |
| `75%` | 제3사분위수 |
| `max` | 최댓값 |

최솟값과 최댓값이 현실적으로 가능한 범위인지 살펴보면 이상치를 발견하는 데 도움이 된다. 평균과 중앙값의 차이가 크다면 데이터가 한쪽으로 치우쳐 있을 가능성도 생각해볼 수 있다.

문자열을 포함한 모든 컬럼의 요약이 필요하다면 다음처럼 작성한다.

```python
df.describe(include="all")
```

## 자주 사용하는 기본 문법

| 문법 | 역할 |
| --- | --- |
| `import pandas as pd` | Pandas 불러오기 |
| `pd.DataFrame(data)` | Python 객체를 DataFrame으로 변환 |
| `pd.read_csv("data.csv")` | CSV 파일 불러오기 |
| `df.head()` | 앞부분 5개 행 확인 |
| `df.tail()` | 뒷부분 5개 행 확인 |
| `df.shape` | 행과 열 개수 확인 |
| `df.columns` | 컬럼명 확인 |
| `df.info()` | 데이터 타입과 결측치 구조 확인 |
| `df.describe()` | 숫자형 데이터의 기초 통계 확인 |

## 처음 데이터를 받았을 때의 점검 순서

처음 보는 데이터셋을 받았다면 다음 순서로 확인할 수 있다.

```python
import pandas as pd

df = pd.read_csv("data.csv")

print(df.head())
print(df.shape)
print(df.columns)
df.info()
print(df.describe())
```

각 문법을 실행하는 데서 끝내지 말고 결과를 보며 질문을 던지는 것이 중요하다.

1. 데이터의 한 행은 무엇을 의미하는가?
2. 분석에 필요한 컬럼이 모두 존재하는가?
3. 데이터 타입이 각 컬럼의 의미와 맞는가?
4. 결측치나 비정상적인 값이 있는가?
5. 값의 분포가 상식적인 범위에 있는가?

## 마무리

이번 글에서는 DataFrame을 만들고 불러온 뒤 구조를 확인하는 기본 문법을 살펴봤다. 데이터 분석의 첫 단계는 바로 계산을 시작하는 것이 아니라, 데이터가 어떤 형태와 품질을 가졌는지 이해하는 일이다.

`head()`, `shape`, `columns`, `info()`, `describe()`에 익숙해지면 처음 보는 데이터셋도 체계적으로 살펴볼 수 있다. 이후의 정제와 분석 방향 역시 이 첫 점검에서 발견한 특징을 기반으로 결정된다.
