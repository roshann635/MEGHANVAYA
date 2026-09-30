from datetime import datetime, timedelta

class TemporalAligner:
    def align_forecast_to_observation(self, issue_time, lead_time_hours):
        '''
        Aligns a GEFS 00Z forecast to the IMD 24-hr accumulation window.
        IMD window: 03:00 UTC Day N to 03:00 UTC Day N+1
        '''
        valid_start = issue_time + timedelta(hours=lead_time_hours)
        valid_end = valid_start + timedelta(hours=24)
        
        return {
            'issue_time': issue_time,
            'forecast_window_start_utc': valid_start,
            'forecast_window_end_utc': valid_end,
            'requires_accumulation': True
        }
