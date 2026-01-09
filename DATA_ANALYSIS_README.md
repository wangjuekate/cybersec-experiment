# Data Analysis Guide

## Overview

This directory contains Python scripts to extract and analyze data from your Empirica cybersecurity experiment.

## Files

- **`extract_data.py`**: Extract data from Empirica JSON to CSV files
- **`analyze_data.py`**: Perform statistical analysis and generate visualizations
- **`requirements.txt`**: Python package dependencies

## Installation

```bash
# Install required packages
pip install -r requirements.txt
```

## Quick Start

### 1. Extract Data to CSV

```bash
# Extract all data to CSV files
python extract_data.py

# Output: data_export/ directory with CSV files
```

### 2. Run Full Analysis

```bash
# Run complete analysis with visualizations
python analyze_data.py

# Output:
# - data_export/ - CSV files
# - figures/ - Visualization plots
# - Console output with statistics
```

### 3. Summary Statistics Only

```bash
# Just print summary without exporting
python extract_data.py --summary-only
```

## Detailed Usage

### Extract Data Script

```bash
# Basic usage
python extract_data.py

# Custom data file location
python extract_data.py --data-file /path/to/tajriba.json

# Custom output directory
python extract_data.py --output-dir my_data

# Summary only (no CSV export)
python extract_data.py --summary-only
```

### Analysis Script

The analysis script automatically:
1. Loads experiment data
2. Analyzes disclosure patterns
3. Analyzes AI model performance
4. Compares cooperation vs competition phases
5. Analyzes player payoffs
6. Generates visualizations
7. Exports CSV files

```python
# Run from Python
from analyze_data import ExperimentAnalyzer

analyzer = ExperimentAnalyzer()
analyzer.run_full_analysis()
```

## Output Files

### CSV Files (in `data_export/`)

1. **`games_TIMESTAMP.csv`**
   - Game-level data
   - Columns: game_id, treatment, governance_regime, absorptive_capacity, threat_volatility, phase

2. **`players_TIMESTAMP.csv`**
   - Player-level data
   - Columns: player_id, game_id, absorptive_capacity, total_payoff, threat_portfolio, learned_signals

3. **`rounds_TIMESTAMP.csv`**
   - Round-level data
   - Columns: round_id, game_id, round_index, task, shared_telemetry, ai_model_accuracy

4. **`disclosure_decisions_TIMESTAMP.csv`**
   - Disclosure decisions per player per round
   - Columns: player_id, round_id, disclosure_amount, disclosure_resolution, num_signals_shared

5. **`competition_strategies_TIMESTAMP.csv`**
   - Competition strategies and outcomes
   - Columns: player_id, round_id, strategy, payoff, detection_accuracy

### Visualizations (in `figures/`)

1. **`disclosure_distribution.png`**
   - Bar chart of disclosure decisions (none/partial/full)

2. **`ai_accuracy_over_time.png`**
   - Line plot of AI model accuracy across rounds

3. **`disclosure_by_regime.png`**
   - Grouped bar chart comparing disclosure patterns across governance regimes

## Data Structure

### Empirica Data Location

```
.empirica/local/tajriba.json
```

This JSON file contains all experiment data:
- Games
- Players
- Rounds
- Stages
- Player decisions
- Timestamps

### Data Hierarchy

```
Game
├── Players (3-5 per game)
├── Rounds (12 total: 8 collaboration + 4 competition)
│   ├── Stages (disclosure, AI aggregation, results, competition)
│   └── Player Decisions
│       ├── Disclosure decisions (collaboration rounds)
│       └── Competition strategies (competition rounds)
```

## Analysis Examples

### Example 1: Disclosure Patterns by Governance

```python
from extract_data import EmpiricaDataExtractor

extractor = EmpiricaDataExtractor()
data = extractor.create_analysis_dataset()

# Disclosure by governance regime
import pandas as pd
disclosure_by_regime = pd.crosstab(
    data['governance_regime'],
    data['disclosure_amount'],
    normalize='index'
) * 100

print(disclosure_by_regime)
```

### Example 2: AI Accuracy Progression

```python
extractor = EmpiricaDataExtractor()
rounds = extractor.extract_rounds()

# Average AI accuracy by round
accuracy_by_round = rounds.groupby('round_index')['ai_model_accuracy'].mean()
print(accuracy_by_round)
```

### Example 3: Player Payoffs

```python
extractor = EmpiricaDataExtractor()
players = extractor.extract_players()

# Payoff statistics
print(f"Mean payoff: {players['total_payoff'].mean():.2f}")
print(f"Std payoff: {players['total_payoff'].std():.2f}")
```

### Example 4: Cooperation Rates

```python
extractor = EmpiricaDataExtractor()
decisions = extractor.extract_disclosure_decisions()

# Calculate cooperation rate (partial or full disclosure)
cooperation_rate = (
    (decisions['disclosure_amount'] != 'none').mean() * 100
)
print(f"Cooperation rate: {cooperation_rate:.1f}%")
```

## Advanced Analysis

### Custom Analysis Script

```python
from extract_data import EmpiricaDataExtractor
import pandas as pd

# Load data
extractor = EmpiricaDataExtractor()
data = extractor.create_analysis_dataset()

# Your custom analysis
# Example: Effect of absorptive capacity on disclosure
high_capacity = data[data['absorptive_capacity'] == 'high']
low_capacity = data[data['absorptive_capacity'] == 'low']

print("High capacity disclosure:")
print(high_capacity['disclosure_amount'].value_counts(normalize=True))

print("\nLow capacity disclosure:")
print(low_capacity['disclosure_amount'].value_counts(normalize=True))
```

### Statistical Tests

```python
from scipy import stats

# Chi-square test for disclosure by governance regime
contingency_table = pd.crosstab(
    data['governance_regime'],
    data['disclosure_amount']
)

chi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)
print(f"Chi-square test: χ²={chi2:.2f}, p={p_value:.4f}")
```

### Regression Analysis

```python
import statsmodels.api as sm

# Encode categorical variables
data_encoded = pd.get_dummies(
    data,
    columns=['governance_regime', 'absorptive_capacity', 'disclosure_amount']
)

# Logistic regression for disclosure decision
X = data_encoded[['governance_regime_open', 'absorptive_capacity_high', 'round_index']]
y = data_encoded['disclosure_amount_full']

X = sm.add_constant(X)
model = sm.Logit(y, X).fit()
print(model.summary())
```

## Troubleshooting

### No Data Found

**Error:** `FileNotFoundError: Data file not found`

**Solution:**
1. Make sure you've run the experiment
2. Check that `.empirica/local/tajriba.json` exists
3. Verify you're in the correct directory

### Empty DataFrames

**Issue:** Scripts run but no data extracted

**Solution:**
1. Verify experiment has completed games
2. Check that players made decisions
3. Look at the raw JSON file to verify data exists

### Import Errors

**Error:** `ModuleNotFoundError: No module named 'pandas'`

**Solution:**
```bash
pip install -r requirements.txt
```

### Visualization Issues

**Error:** Plots not generating

**Solution:**
1. Ensure matplotlib is installed
2. Check that data exists for plotting
3. Verify output directory permissions

## Data Privacy

### Anonymization

Before sharing data:

```python
# Remove player identifiers
players = extractor.extract_players()
players_anon = players.drop(columns=['identifier'])
players_anon['player_id'] = range(len(players_anon))
```

### Aggregation

Share only aggregated data:

```python
# Aggregate to game level
game_summary = data.groupby('game_id').agg({
    'disclosure_amount': lambda x: (x != 'none').mean(),
    'ai_model_accuracy': 'mean',
    'total_payoff': 'mean'
})
```

## Tips

1. **Run analysis after each session** to verify data collection
2. **Backup raw JSON** before analysis: `cp .empirica/local/tajriba.json backups/`
3. **Export CSV immediately** after experiment completion
4. **Check data quality** with summary statistics first
5. **Use version control** for analysis scripts

## Support

For issues or questions:
1. Check this README
2. Review the script comments
3. Examine the raw JSON structure
4. Consult Empirica documentation: https://docs.empirica.ly
