import json
import pickle
from pathlib import Path

import numpy as np
from django.conf import settings


class BangaloreHomePriceModel:
    def __init__(self):
        self.model = None
        self.columns = None

    def load_artifacts(self):
        base_dir = Path(settings.BASE_DIR)

        model_path = base_dir / "artifacts" / "bangalore_home_price" / "bangalore_home_prices_model.pickle"
        columns_path = base_dir / "artifacts" / "bangalore_home_price" / "columns.json"

        with open(columns_path, "r") as f:
            data = json.load(f)
            self.columns = data["data_columns"]

        with open(model_path, "rb") as f:
            self.model = pickle.load(f)

    def ensure_loaded(self):
        if self.model is None or self.columns is None:
            self.load_artifacts()

    def get_locations(self):
        self.ensure_loaded()

        # First 3 columns are usually total_sqft, bath, bhk
        return self.columns[3:]

    def predict_price(self, location, sqft, bath, bhk):
        self.ensure_loaded()

        location = location.lower()

        x = np.zeros(len(self.columns))

        x[0] = sqft
        x[1] = bath
        x[2] = bhk

        if location in self.columns:
            loc_index = self.columns.index(location)
            x[loc_index] = 1

        prediction = self.model.predict([x])[0]

        return round(float(prediction), 2)


home_price_model = BangaloreHomePriceModel()