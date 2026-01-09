#!/usr/bin/env python3
"""
Data Analysis Script for Cybersecurity Intelligence Sharing Experiment
Performs statistical analysis and generates visualizations
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from extract_data import EmpiricaDataExtractor


class ExperimentAnalyzer:
    """Analyze experiment data and generate insights"""
    
    def __init__(self, data_file: str = ".empirica/local/tajriba.json"):
        """Initialize analyzer with data extractor"""
        self.extractor = EmpiricaDataExtractor(data_file)
        self.data = None
        
    def load_and_prepare_data(self):
        """Load and prepare data for analysis"""
        print("Loading experiment data...")
        self.data = self.extractor.create_analysis_dataset()
        return self
    
    def analyze_disclosure_patterns(self):
        """Analyze disclosure decision patterns"""
        if self.data is None or self.data.empty:
            print("No data available")
            return
        
        print("\n" + "="*60)
        print("DISCLOSURE PATTERN ANALYSIS")
        print("="*60)
        
        # Overall disclosure rates
        print("\nOverall Disclosure Rates:")
        disclosure_counts = self.data['disclosure_amount'].value_counts()
        disclosure_pcts = self.data['disclosure_amount'].value_counts(normalize=True) * 100
        
        for amount in ['none', 'partial', 'full']:
            if amount in disclosure_counts.index:
                print(f"  {amount.capitalize()}: {disclosure_counts[amount]} ({disclosure_pcts[amount]:.1f}%)")
        
        # By governance regime
        if 'governance_regime' in self.data.columns:
            print("\nDisclosure by Governance Regime:")
            regime_disclosure = pd.crosstab(
                self.data['governance_regime'],
                self.data['disclosure_amount'],
                normalize='index'
            ) * 100
            print(regime_disclosure.round(1))
        
        # By absorptive capacity
        if 'absorptive_capacity' in self.data.columns:
            print("\nDisclosure by Absorptive Capacity:")
            capacity_disclosure = pd.crosstab(
                self.data['absorptive_capacity'],
                self.data['disclosure_amount'],
                normalize='index'
            ) * 100
            print(capacity_disclosure.round(1))
        
        # Over time (by round)
        if 'round_index' in self.data.columns:
            print("\nDisclosure Over Time:")
            time_disclosure = self.data.groupby('round_index')['disclosure_amount'].value_counts(normalize=True).unstack(fill_value=0) * 100
            print(time_disclosure.round(1))
    
    def analyze_ai_performance(self):
        """Analyze AI model accuracy over time"""
        rounds_df = self.extractor.extract_rounds()
        
        if rounds_df.empty or 'ai_model_accuracy' not in rounds_df.columns:
            print("\nNo AI accuracy data available")
            return
        
        print("\n" + "="*60)
        print("AI MODEL PERFORMANCE ANALYSIS")
        print("="*60)
        
        print(f"\nAI Accuracy Statistics:")
        print(f"  Mean: {rounds_df['ai_model_accuracy'].mean():.2%}")
        print(f"  Std: {rounds_df['ai_model_accuracy'].std():.2%}")
        print(f"  Min: {rounds_df['ai_model_accuracy'].min():.2%}")
        print(f"  Max: {rounds_df['ai_model_accuracy'].max():.2%}")
        
        # Accuracy by round
        if 'round_index' in rounds_df.columns:
            print("\nAccuracy by Round:")
            round_accuracy = rounds_df.groupby('round_index')['ai_model_accuracy'].mean()
            for idx, acc in round_accuracy.items():
                print(f"  Round {idx}: {acc:.2%}")
    
    def analyze_cooperation_vs_competition(self):
        """Compare behavior in cooperation vs competition phases"""
        if self.data is None or 'task' not in self.data.columns:
            print("\nNo task data available")
            return
        
        print("\n" + "="*60)
        print("COOPERATION VS COMPETITION ANALYSIS")
        print("="*60)
        
        # Disclosure in collaboration rounds
        collab_data = self.data[self.data['task'] == 'collaboration']
        if not collab_data.empty:
            print("\nCollaboration Phase Disclosure:")
            collab_disclosure = collab_data['disclosure_amount'].value_counts(normalize=True) * 100
            for amount, pct in collab_disclosure.items():
                print(f"  {amount.capitalize()}: {pct:.1f}%")
        
        # Competition strategies
        comp_strategies = self.extractor.extract_competition_strategies()
        if not comp_strategies.empty:
            print("\nCompetition Phase Strategies:")
            strategy_counts = comp_strategies['strategy'].value_counts(normalize=True) * 100
            for strategy, pct in strategy_counts.items():
                print(f"  {strategy.capitalize()}: {pct:.1f}%")
    
    def analyze_payoffs(self):
        """Analyze player payoffs"""
        players_df = self.extractor.extract_players()
        
        if players_df.empty or 'total_payoff' not in players_df.columns:
            print("\nNo payoff data available")
            return
        
        print("\n" + "="*60)
        print("PAYOFF ANALYSIS")
        print("="*60)
        
        print(f"\nPayoff Statistics:")
        print(f"  Mean: {players_df['total_payoff'].mean():.2f}")
        print(f"  Std: {players_df['total_payoff'].std():.2f}")
        print(f"  Min: {players_df['total_payoff'].min():.2f}")
        print(f"  Max: {players_df['total_payoff'].max():.2f}")
    
    def generate_visualizations(self, output_dir: str = "figures"):
        """Generate visualization plots"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        sns.set_style("whitegrid")
        
        # 1. Disclosure distribution
        if self.data is not None and not self.data.empty:
            plt.figure(figsize=(10, 6))
            disclosure_counts = self.data['disclosure_amount'].value_counts()
            plt.bar(disclosure_counts.index, disclosure_counts.values)
            plt.title('Distribution of Disclosure Decisions')
            plt.xlabel('Disclosure Amount')
            plt.ylabel('Count')
            plt.savefig(output_path / 'disclosure_distribution.png', dpi=300, bbox_inches='tight')
            plt.close()
            print(f"✓ Saved disclosure_distribution.png")
        
        # 2. AI accuracy over time
        rounds_df = self.extractor.extract_rounds()
        if not rounds_df.empty and 'ai_model_accuracy' in rounds_df.columns:
            plt.figure(figsize=(10, 6))
            round_accuracy = rounds_df.groupby('round_index')['ai_model_accuracy'].mean()
            plt.plot(round_accuracy.index, round_accuracy.values, marker='o')
            plt.title('AI Model Accuracy Over Rounds')
            plt.xlabel('Round')
            plt.ylabel('Accuracy')
            plt.ylim(0, 1)
            plt.grid(True, alpha=0.3)
            plt.savefig(output_path / 'ai_accuracy_over_time.png', dpi=300, bbox_inches='tight')
            plt.close()
            print(f"✓ Saved ai_accuracy_over_time.png")
        
        # 3. Disclosure by governance regime
        if self.data is not None and 'governance_regime' in self.data.columns:
            plt.figure(figsize=(12, 6))
            regime_disclosure = pd.crosstab(
                self.data['governance_regime'],
                self.data['disclosure_amount'],
                normalize='index'
            ) * 100
            regime_disclosure.plot(kind='bar', stacked=False)
            plt.title('Disclosure Patterns by Governance Regime')
            plt.xlabel('Governance Regime')
            plt.ylabel('Percentage')
            plt.legend(title='Disclosure Amount')
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.savefig(output_path / 'disclosure_by_regime.png', dpi=300, bbox_inches='tight')
            plt.close()
            print(f"✓ Saved disclosure_by_regime.png")
        
        print(f"\n✓ All visualizations saved to {output_path}/")
    
    def run_full_analysis(self, export_csv: bool = True, generate_plots: bool = True):
        """Run complete analysis pipeline"""
        print("\n" + "="*60)
        print("CYBERSECURITY EXPERIMENT DATA ANALYSIS")
        print("="*60)
        
        # Load data
        self.load_and_prepare_data()
        
        # Run analyses
        self.analyze_disclosure_patterns()
        self.analyze_ai_performance()
        self.analyze_cooperation_vs_competition()
        self.analyze_payoffs()
        
        # Export data
        if export_csv:
            print("\nExporting data to CSV...")
            self.extractor.export_to_csv()
        
        # Generate visualizations
        if generate_plots:
            print("\nGenerating visualizations...")
            self.generate_visualizations()
        
        print("\n" + "="*60)
        print("ANALYSIS COMPLETE")
        print("="*60)


def main():
    """Main analysis function"""
    analyzer = ExperimentAnalyzer()
    
    try:
        analyzer.run_full_analysis(export_csv=True, generate_plots=True)
    except FileNotFoundError:
        print("\n✗ Error: No experiment data found")
        print("  Run your experiment first to generate data")
        return 1
    except Exception as e:
        print(f"\n✗ Error during analysis: {e}")
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())
