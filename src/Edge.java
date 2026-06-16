public class Edge {
    private StationNode stationA;
    private StationNode stationB;
    private TravelType travelType;

    private int timeCost;
    private double pollutionCost;

    public Edge(StationNode stationA, StationNode stationB, TravelType travelType, int timeCost, double pollutionCost) {
        this.stationA = stationA;
        this.stationB = stationB;
        this.travelType = travelType;
        this.timeCost = timeCost;
        this.pollutionCost = pollutionCost;
    }

    public StationNode getStationA() {
        return stationA;
    }

    public StationNode getStationB() {
        return stationB;
    }

    public TravelType getTravelType() {
        return travelType;
    }

    public int getTimeCost() {
        return timeCost;
    }

    public double getPollutionCost() {
        return pollutionCost;
    }

    public StationNode getOtherStation(StationNode current) {
        if (current.equals(stationA)) {
            return stationB;
        } else if (current.equals(stationB)) {
            return stationA;
        } else {
            throw new IllegalArgumentException("Station is not connected to this edge.");
        }
    }

    @Override
    public String toString() {
        return stationA + " <-> " + stationB +
                " | " + travelType +
                " | time: " + timeCost + " min" +
                " | pollution: " + pollutionCost;
    }
}