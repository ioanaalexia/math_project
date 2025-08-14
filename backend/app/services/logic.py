from app.extensions import cache


@cache.memoize(timeout=300)
def calculate_power(base, exp):
    return base ** exp


@cache.memoize(timeout=300)
def factorial(n):
    if n < 0:
        raise ValueError("Negative not allowed")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


@cache.memoize(timeout=300)
def fibonacci(n):
    print(f"Calcul fibonacci({n})")
    if n < 0:
        raise ValueError("Negative not allowed")
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
