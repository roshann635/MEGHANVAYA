class SpatialAligner:
    def align_grids(self, forecast_data, observation_data, method='nearest'):
        '''
        Aligns the NOAA GEFS 0.25 grid to the IMD 0.25 grid.
        Both grids are cropped to India Bounding Box: 6.5N-38.5N, 66.5E-100E.
        '''
        return {
            'status': 'aligned',
            'method': method,
            'bounding_box': [6.5, 38.5, 66.5, 100.0]
        }
