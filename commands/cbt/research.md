---
name: cbt:research
description: Deep research to validate strategy hypothesis with literature, implementations, and risk analysis
argument-hint: "[literature|implementations|risks]"
allowed-tools:
  - Read
  - Write
  - WebSearch
  - WebFetch
  - Task
  - AskUserQuestion
---

<objective>
Conduct thorough online research to validate the strategy hypothesis, find existing implementations,
identify risks, and discover additional features. Output comprehensive RESEARCH.md.
</objective>

<execution_context>
@strategies/{active}/DISCOVERY.md
@strategies/{active}/.cbt/state.yaml
</execution_context>

<principles>
- Cite all sources with links
- Distinguish fact from opinion
- Be honest about edge decay and market efficiency
- Don't oversell - flag if research contradicts hypothesis
- Heavy token usage is acceptable here - depth matters
</principles>

<process>

## 1. Load Context

Read DISCOVERY.md to extract:
- Core hypothesis
- Strategy type
- Key concepts/terms for search
- Questions from discovery phase

## 2. Determine Research Scope

If argument provided:
- `literature` - Only academic/blog research
- `implementations` - Only code/GitHub search
- `risks` - Only pitfalls and failure modes

If no argument: Run full research (all areas).

## 3. Literature Research

Search for academic and practitioner content:

### Search Terms (generate from DISCOVERY.md)
- Core concept keywords
- Asset class + strategy type
- Feature/indicator names
- Author names if mentioned

### Sources to Search
- arXiv quantitative finance
- SSRN working papers
- QuantStart, QuantPedia blogs
- Medium finance/trading tags
- Academic Google results

### For Each Relevant Result
- Title and authors
- Key findings summary
- Relevance to our strategy (1-5 rating)
- Direct quotes if useful
- Link

## 4. Implementation Research

Search for existing code:

### GitHub Search
- Strategy keywords + "backtest"
- Feature names + "python"
- Similar strategy names

### Other Sources
- Kaggle notebooks
- QuantConnect community
- Backtrader forums
- Trading-focused repos

### For Each Relevant Repo
- Repository link
- Star count / activity
- What it implements
- Useful patterns to borrow
- Differences from our approach

## 5. Market Validation

Assess edge viability:

### Questions to Answer
- Is this edge documented in academic literature?
- Has it been arbitraged away? (check papers on decay)
- What market regimes does it work in?
- Who else is likely trading this?
- Is there a theoretical basis for why this works?

### Output
- Confidence level (Low/Medium/High)
- Edge durability assessment
- Regime dependency analysis

## 6. Feature Discovery

Find additional features others use:

### Search For
- Features used in similar strategies
- Alternative indicators
- Data sources not considered

### Output
- New feature ideas with sources
- Implementation complexity
- Priority ranking

## 7. Risk Analysis

Identify potential failure modes:

### Categories
- **Overfitting risks**: In-sample vs out-of-sample concerns
- **Execution risks**: Slippage, fill rates, latency
- **Data risks**: Look-ahead bias, survivorship bias
- **Market risks**: Regime changes, black swans
- **Structural risks**: Crowding, capacity limits

### Historical Failures
- Search for "strategy name + failed"
- Search for "strategy type + problems"

## 8. Generate RESEARCH.md

```markdown
# Strategy Research: {name}

**Date:** {date}
**Research Scope:** {Full / Literature / Implementations / Risks}

---

## Executive Summary

{3-5 sentences summarizing research findings and confidence level}

**Overall Confidence:** {Low / Medium / High}
**Recommendation:** {Proceed / Proceed with caution / Reconsider}

---

## 1. Literature Review

### Academic Papers

| Title | Authors | Year | Relevance | Key Finding |
|-------|---------|------|-----------|-------------|
| {title} | {authors} | {year} | ⭐⭐⭐⭐⭐ | {finding} |

### Key Insights
1. {insight from paper 1}
2. {insight from paper 2}
3. {insight from paper 3}

### Recommended Reading
- [{title}]({url}) - {why it's relevant}
- [{title}]({url}) - {why it's relevant}

---

## 2. Existing Implementations

### GitHub Repositories

| Repository | Stars | Language | Relevance |
|------------|-------|----------|-----------|
| [{name}]({url}) | {stars} | {lang} | {description} |

### Useful Patterns Found
```python
# Example pattern from {repo}
{code snippet}
```

### Differences from Our Approach
- {difference 1}
- {difference 2}

---

## 3. Edge Validation

### Is This Edge Real?

| Factor | Assessment | Notes |
|--------|------------|-------|
| Academic support | {Yes/Partial/No} | {notes} |
| Still profitable | {Likely/Uncertain/Unlikely} | {notes} |
| Theoretical basis | {Strong/Weak/None} | {notes} |
| Competition level | {Low/Medium/High} | {notes} |

### Regime Analysis

| Market Regime | Expected Performance |
|---------------|---------------------|
| Bull market | {assessment} |
| Bear market | {assessment} |
| High volatility | {assessment} |
| Low volatility | {assessment} |
| Trending | {assessment} |
| Mean-reverting | {assessment} |

### Edge Durability
{Assessment of whether edge will persist}

---

## 4. Feature Ideas

| Feature | Source | Priority | Complexity |
|---------|--------|----------|------------|
| {feature} | {paper/repo} | High/Med/Low | Easy/Med/Hard |

### Implementation Notes
{Any specific notes on implementing these features}

---

## 5. Risks & Pitfalls

### Critical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| {risk} | High/Med/Low | High/Med/Low | {how to mitigate} |

### Historical Failures
- {Example of similar strategy that failed and why}

### Red Flags to Watch
- [ ] {warning sign 1}
- [ ] {warning sign 2}
- [ ] {warning sign 3}

---

## 6. Research Conclusions

### Strengths
- {strength 1}
- {strength 2}

### Weaknesses
- {weakness 1}
- {weakness 2}

### Recommendations
1. {specific recommendation}
2. {specific recommendation}

### Updated Kill Criteria
Based on research, also abandon if:
- {new criterion from research}

---

## Sources

### Papers
1. [{title}]({url})
2. [{title}]({url})

### Code
1. [{repo}]({url})
2. [{repo}]({url})

### Articles
1. [{title}]({url})
2. [{title}]({url})

---

*Generated by CBT Framework /cbt:research*
```

## 9. Update State

```yaml
phases_completed:
  research: true
phase: config
```

## 10. Output Summary

```
Research Complete!

Created: RESEARCH.md

Key Findings:
- Confidence: {level}
- {count} relevant papers found
- {count} code repositories reviewed
- {count} risks identified
- {count} new feature ideas

Recommendation: {proceed/caution/reconsider}

Next: /cbt:config
```

</process>

<success_criteria>
- [ ] Literature searched and summarized
- [ ] Implementations found and documented
- [ ] Edge validity assessed
- [ ] Risks catalogued with mitigations
- [ ] All sources cited with links
- [ ] RESEARCH.md created
- [ ] State updated
</success_criteria>
