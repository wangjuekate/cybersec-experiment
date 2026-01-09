#!/usr/bin/env python3
"""
Empirica Experiment Data Extractor
Extracts and processes data from the cybersecurity intelligence sharing experiment
"""

import json
import pandas as pd
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any
import argparse


class EmpiricaDataExtractor:
    """Extract and process Empirica experiment data"""
    
    def __init__(self, data_file: str = ".empirica/local/tajriba.json"):
        """
        Initialize the data extractor
        
        Args:
            data_file: Path to the Empirica JSON data file
        """
        self.data_file = Path(data_file)
        self.data = None
        self.games = []
        self.players = []
        self.rounds = []
        self.stages = []
        
    def load_data(self):
        """Load the Empirica JSON data file (NDJSON format)"""
        if not self.data_file.exists():
            raise FileNotFoundError(f"Data file not found: {self.data_file}")
        
        # Parse NDJSON format (each line is a JSON object)
        scopes = []
        attributes = []
        
        with open(self.data_file, 'r') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                    
                try:
                    obj = json.loads(line)
                    kind = obj.get('kind')
                    
                    if kind == 'Scope':
                        scopes.append(obj.get('obj', {}))
                    elif kind == 'Attribute':
                        attributes.append(obj.get('obj', {}))
                        
                except json.JSONDecodeError:
                    continue
        
        # Build data structure
        self.data = {
            'scopes': scopes,
            'attributes': attributes
        }
        
        print(f"✓ Loaded data from {self.data_file}")
        print(f"  Found {len(scopes)} scopes and {len(attributes)} attributes")
        return self
    
    def extract_games(self) -> pd.DataFrame:
        """Extract game-level data"""
        games_data = []
        
        # Find game scopes
        game_scopes = [s for s in self.data.get('scopes', []) if s.get('kind') == 'game']
        
        for game in game_scopes:
            game_id = game.get('id')
            
            # Get attributes for this game
            game_attrs = {}
            for attr in self.data.get('attributes', []):
                if attr.get('nodeID') == game_id:
                    key = attr.get('key')
                    val = attr.get('val')
                    
                    # Parse JSON values
                    try:
                        if val and isinstance(val, str):
                            val = json.loads(val)
                    except:
                        pass
                    
                    game_attrs[key] = val
            
            # Extract treatment info
            treatment = game_attrs.get('treatment', {})
            if isinstance(treatment, dict):
                games_data.append({
                    'game_id': game_id,
                    'treatment_name': game_attrs.get('treatmentName'),
                    'governance_regime': treatment.get('governanceRegime'),
                    'absorptive_capacity': treatment.get('absorptiveCapacity'),
                    'threat_volatility': treatment.get('threatVolatility'),
                    'player_count': treatment.get('playerCount'),
                    'collaboration_rounds': treatment.get('collaborationRounds'),
                    'competition_rounds': treatment.get('competitionRounds'),
                    'created_at': game.get('createdAt'),
                })
        
        self.games = pd.DataFrame(games_data)
        print(f"✓ Extracted {len(self.games)} games")
        return self.games
    
    def extract_players(self) -> pd.DataFrame:
        """Extract player-level data"""
        players_data = []
        
        # Find player scopes
        player_scopes = [s for s in self.data.get('scopes', []) if s.get('kind') == 'player']
        
        for player in player_scopes:
            player_id = player.get('id')
            
            # Get attributes for this player
            player_attrs = {}
            for attr in self.data.get('attributes', []):
                if attr.get('nodeID') == player_id:
                    key = attr.get('key')
                    val = attr.get('val')
                    
                    # Parse JSON values
                    try:
                        if val and isinstance(val, str):
                            val = json.loads(val)
                    except:
                        pass
                    
                    player_attrs[key] = val
            
            # Find parent game
            parent_scopes = [s for s in self.data.get('scopes', []) 
                           if s.get('kind') == 'game' and any(
                               attr.get('nodeID') == s.get('id') and 
                               attr.get('key') == 'playerIDs' and 
                               player_id in str(attr.get('val', ''))
                               for attr in self.data.get('attributes', [])
                           )]
            
            game_id = parent_scopes[0].get('id') if parent_scopes else None
            
            players_data.append({
                'player_id': player_id,
                'game_id': game_id,
                'identifier': player_attrs.get('identifier'),
                'absorptive_capacity': player_attrs.get('absorptiveCapacity'),
                'baseline_detection': player_attrs.get('baselineDetection'),
                'total_payoff': player_attrs.get('totalPayoff'),
                'final_payoff': player_attrs.get('finalPayoff'),
                'threat_portfolio': player_attrs.get('threatPortfolio'),
                'learned_signals': player_attrs.get('learnedSignals'),
                'leakage_history': player_attrs.get('leakageHistory'),
            })
        
        self.players = pd.DataFrame(players_data)
        print(f"✓ Extracted {len(self.players)} players")
        return self.players
    
    def extract_rounds(self) -> pd.DataFrame:
        """Extract round-level data"""
        rounds_data = []
        
        # Find round scopes
        round_scopes = [s for s in self.data.get('scopes', []) if s.get('kind') == 'round']
        
        for round_scope in round_scopes:
            round_id = round_scope.get('id')
            
            # Get attributes for this round
            round_attrs = {}
            for attr in self.data.get('attributes', []):
                if attr.get('nodeID') == round_id:
                    key = attr.get('key')
                    val = attr.get('val')
                    
                    # Parse JSON values
                    try:
                        if val and isinstance(val, str):
                            val = json.loads(val)
                    except:
                        pass
                    
                    round_attrs[key] = val
            
            rounds_data.append({
                'round_id': round_id,
                'round_index': round_attrs.get('index'),
                'task': round_attrs.get('task'),
                'shared_telemetry': round_attrs.get('sharedTelemetry'),
                'ai_model_accuracy': round_attrs.get('aiModelAccuracy'),
            })
        
        self.rounds = pd.DataFrame(rounds_data)
        print(f"✓ Extracted {len(self.rounds)} rounds")
        return self.rounds
    
    def extract_disclosure_decisions(self) -> pd.DataFrame:
        """Extract disclosure decisions from each round"""
        decisions_data = []
        
        # Find playerRound scopes
        player_round_scopes = [s for s in self.data.get('scopes', []) if s.get('kind') == 'playerRound']
        
        for pr_scope in player_round_scopes:
            pr_id = pr_scope.get('id')
            
            # Get attributes for this playerRound
            pr_attrs = {}
            for attr in self.data.get('attributes', []):
                if attr.get('nodeID') == pr_id:
                    key = attr.get('key')
                    val = attr.get('val')
                    
                    # Parse JSON values
                    try:
                        if val and isinstance(val, str):
                            val = json.loads(val)
                    except:
                        pass
                    
                    pr_attrs[key] = val
            
            if 'disclosureDecision' in pr_attrs:
                decision = pr_attrs['disclosureDecision']
                if isinstance(decision, dict):
                    decisions_data.append({
                        'player_round_id': pr_id,
                        'disclosure_amount': decision.get('amount'),
                        'disclosure_resolution': decision.get('resolution'),
                        'num_signals_shared': len(decision.get('signals', [])) if decision.get('signals') else 0,
                        'signals_shared': decision.get('signals'),
                    })
        
        decisions_df = pd.DataFrame(decisions_data)
        print(f"✓ Extracted {len(decisions_df)} disclosure decisions")
        return decisions_df
    
    def extract_competition_strategies(self) -> pd.DataFrame:
        """Extract competition strategies from competition rounds"""
        strategies_data = []
        
        # Find playerRound scopes
        player_round_scopes = [s for s in self.data.get('scopes', []) if s.get('kind') == 'playerRound']
        
        for pr_scope in player_round_scopes:
            pr_id = pr_scope.get('id')
            
            # Get attributes for this playerRound
            pr_attrs = {}
            for attr in self.data.get('attributes', []):
                if attr.get('nodeID') == pr_id:
                    key = attr.get('key')
                    val = attr.get('val')
                    
                    # Parse JSON values
                    try:
                        if val and isinstance(val, str):
                            val = json.loads(val)
                    except:
                        pass
                    
                    pr_attrs[key] = val
            
            if 'competitionStrategy' in pr_attrs:
                strategies_data.append({
                    'player_round_id': pr_id,
                    'strategy': pr_attrs['competitionStrategy'],
                    'payoff': pr_attrs.get('payoff'),
                    'competition_score': pr_attrs.get('competitionScore'),
                    'detection_accuracy': pr_attrs.get('detectionAccuracy'),
                })
        
        strategies_df = pd.DataFrame(strategies_data)
        print(f"✓ Extracted {len(strategies_df)} competition strategies")
        return strategies_df
    
    def extract_chat_messages(self) -> pd.DataFrame:
        """Extract chat messages"""
        chat_data = []
        
        # Find game scopes and their chat history
        game_scopes = [s for s in self.data.get('scopes', []) if s.get('kind') == 'game']
        
        for game in game_scopes:
            game_id = game.get('id')
            
            # Get chat history attribute
            for attr in self.data.get('attributes', []):
                if attr.get('nodeID') == game_id and attr.get('key') == 'chatHistory':
                    val = attr.get('val')
                    
                    try:
                        if val and isinstance(val, str):
                            chat_history = json.loads(val)
                            
                            if isinstance(chat_history, list):
                                for msg in chat_history:
                                    if isinstance(msg, dict):
                                        chat_data.append({
                                            'game_id': game_id,
                                            'message_id': msg.get('id'),
                                            'player_id': msg.get('playerId'),
                                            'player_name': msg.get('playerName'),
                                            'text': msg.get('text'),
                                            'timestamp': msg.get('timestamp'),
                                        })
                    except:
                        pass
        
        chat_df = pd.DataFrame(chat_data)
        print(f"✓ Extracted {len(chat_df)} chat messages")
        return chat_df
    
    def extract_all(self) -> Dict[str, pd.DataFrame]:
        """Extract all data and return as dictionary of DataFrames"""
        self.load_data()
        
        return {
            'games': self.extract_games(),
            'players': self.extract_players(),
            'rounds': self.extract_rounds(),
            'disclosure_decisions': self.extract_disclosure_decisions(),
            'competition_strategies': self.extract_competition_strategies(),
            'chat_messages': self.extract_chat_messages(),
        }
    
    def export_to_csv(self, output_dir: str = "data_export"):
        """Export all data to CSV files"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        data_dict = self.extract_all()
        
        for name, df in data_dict.items():
            if not df.empty:
                filename = output_path / f"{name}_{timestamp}.csv"
                df.to_csv(filename, index=False)
                print(f"✓ Exported {name} to {filename}")
        
        print(f"\n✓ All data exported to {output_path}/")
        return output_path
    
    def create_analysis_dataset(self) -> pd.DataFrame:
        """Create a merged dataset for analysis"""
        data_dict = self.extract_all()
        
        # Merge disclosure decisions with player and round info
        df = data_dict['disclosure_decisions'].copy()
        
        # Add player info
        if not data_dict['players'].empty:
            df = df.merge(
                data_dict['players'][['player_id', 'game_id', 'absorptive_capacity', 'total_payoff']],
                on='player_id',
                how='left'
            )
        
        # Add round info
        if not data_dict['rounds'].empty:
            df = df.merge(
                data_dict['rounds'][['round_id', 'round_index', 'task', 'ai_model_accuracy']],
                on='round_id',
                how='left'
            )
        
        # Add game info
        if not data_dict['games'].empty:
            df = df.merge(
                data_dict['games'][['game_id', 'governance_regime', 'threat_volatility']],
                on='game_id',
                how='left'
            )
        
        print(f"✓ Created analysis dataset with {len(df)} observations")
        return df
    
    def get_summary_statistics(self) -> Dict[str, Any]:
        """Generate summary statistics"""
        data_dict = self.extract_all()
        
        summary = {
            'total_games': len(data_dict['games']),
            'total_players': len(data_dict['players']),
            'total_rounds': len(data_dict['rounds']),
            'total_disclosure_decisions': len(data_dict['disclosure_decisions']),
            'total_competition_decisions': len(data_dict['competition_strategies']),
        }
        
        # Disclosure statistics
        if not data_dict['disclosure_decisions'].empty:
            dd = data_dict['disclosure_decisions']
            summary['disclosure_none_pct'] = (dd['disclosure_amount'] == 'none').mean() * 100
            summary['disclosure_partial_pct'] = (dd['disclosure_amount'] == 'partial').mean() * 100
            summary['disclosure_full_pct'] = (dd['disclosure_amount'] == 'full').mean() * 100
            summary['avg_signals_shared'] = dd['num_signals_shared'].mean()
        
        # AI accuracy statistics
        if not data_dict['rounds'].empty:
            summary['avg_ai_accuracy'] = data_dict['rounds']['ai_model_accuracy'].mean()
            summary['max_ai_accuracy'] = data_dict['rounds']['ai_model_accuracy'].max()
        
        return summary
    
    def print_summary(self):
        """Print summary statistics"""
        summary = self.get_summary_statistics()
        
        print("\n" + "="*60)
        print("EXPERIMENT SUMMARY STATISTICS")
        print("="*60)
        
        print(f"\nData Overview:")
        print(f"  Total Games: {summary.get('total_games', 0)}")
        print(f"  Total Players: {summary.get('total_players', 0)}")
        print(f"  Total Rounds: {summary.get('total_rounds', 0)}")
        print(f"  Disclosure Decisions: {summary.get('total_disclosure_decisions', 0)}")
        print(f"  Competition Decisions: {summary.get('total_competition_decisions', 0)}")
        
        if 'disclosure_none_pct' in summary:
            print(f"\nDisclosure Behavior:")
            print(f"  None: {summary['disclosure_none_pct']:.1f}%")
            print(f"  Partial: {summary['disclosure_partial_pct']:.1f}%")
            print(f"  Full: {summary['disclosure_full_pct']:.1f}%")
            print(f"  Avg Signals Shared: {summary['avg_signals_shared']:.2f}")
        
        if 'avg_ai_accuracy' in summary:
            print(f"\nAI Model Performance:")
            print(f"  Average Accuracy: {summary['avg_ai_accuracy']:.2%}")
            print(f"  Maximum Accuracy: {summary['max_ai_accuracy']:.2%}")
        
        print("\n" + "="*60)


def main():
    """Main function for command-line usage"""
    parser = argparse.ArgumentParser(
        description='Extract data from Empirica cybersecurity experiment'
    )
    parser.add_argument(
        '--data-file',
        default='.empirica/local/tajriba.json',
        help='Path to Empirica data file (default: .empirica/local/tajriba.json)'
    )
    parser.add_argument(
        '--output-dir',
        default='data_export',
        help='Output directory for CSV files (default: data_export)'
    )
    parser.add_argument(
        '--summary-only',
        action='store_true',
        help='Only print summary statistics without exporting'
    )
    
    args = parser.parse_args()
    
    # Create extractor
    extractor = EmpiricaDataExtractor(args.data_file)
    
    try:
        if args.summary_only:
            # Just print summary
            extractor.load_data()
            extractor.print_summary()
        else:
            # Export all data
            output_path = extractor.export_to_csv(args.output_dir)
            extractor.print_summary()
            
            print(f"\n✓ Data extraction complete!")
            print(f"  CSV files saved to: {output_path}")
            
    except FileNotFoundError as e:
        print(f"\n✗ Error: {e}")
        print(f"  Make sure Empirica has been run and data exists.")
        return 1
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())
