# Unit Testing Documentation Guide

> Credits to: [`https://dzone.com/articles/unit-testing-guidelines-what-to-test-and-what-not`](https://dzone.com/articles/unit-testing-guidelines-what-to-test-and-what-not)

## Documentation Format

All unit tests are documented in the following form:

```
 /**
  * Description: <Brief description of what the unit test does>
  * Expected Outcome: <Brief description of what the unit test expects as an outcome>
  * Risk Rating: See below (Risk Rating)
  */
```

## Risk Rating

> **Risk Rating** is essentially how risky the bug is (i.e. what the unit test is checking)

`Risk Rating = Probability x Severity`

### Probability

> **Probability** (`%`) is the measure of the chance for an uncertain event to occur — exposure concerning time, proximity, and repetition.

This can be classified as **`Frequent`**, **`Probable`**, **`Occasional`**, **`Remote`**, **`Improbable`**, **`Eliminated`**

- **`Frequent`** — It is expected to occur several times in most circumstances (`91 - 100%`)
- **`Probable`** — Likely to occur several times in most circumstances (`61 - 90%`)
- **`Occasional`** — Might occur sometime (`41 - 60%`)
- **`Remote`** — Unlikely to occur (`11 - 40%`)
- **`Improbable`** — May occur in rare and exceptional circumstances (`0 - 10%`)
- **`Eliminate`** — Impossible to occur (`0%`)

### Severity

> **Severity** is the degree of impact of damage or loss caused due to the uncertain event.

This can be classified as **`Catastrophic`**, **`Critical`**, **`Marginal`**, **`Negligible`**

- **`Catastrophic`** — Harsh consequences that make the project wholly unproductive and could even lead to project shut down. This must be a top priority during risk management.
- **`Critical`** — Large consequences, which can lead to a great amount of loss. The project is severely threatened.
- **`Marginal`** — Short-term damage still reversible through restoration activities.
- **`Negligible`** — Little or minimal damage or loss. This can be monitored and managed by routine procedures.
