# Garmin Activities Downloader

This project allows you to download your Garmin activities in .gpx or .tcx format.

## Installation

1. Install the necessary dependencies by running:
    ```sh
    npm install
    ```
2. Copy and rename the `credentials.dist` file to `credentials.json`. Replace the placeholder values with your actual Garmin credentials (otherwise the credentials will be asked in console).

## Usage

### Download activities in .gpx format
To download activities in .gpx format, run:
```
npm run download-gpx
```

### Download activities in .tcx format
To download activities in .tcx format, run:
```
npm run download-tcx
```

All downloaded files will be saved in the `data` directory.
