package com.optimetro.model;

public class Edge {
    private StationNode fromStation;
    private StationNode toStation;
    private TravelType travelType;

    private double timeCost;
    private double pollutionCost;

    public Edge(StationNode fromStation, StationNode toStation, TravelType travelType, double timeCost, double pollutionCost) {
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.travelType = travelType;
        this.timeCost = timeCost;
        this.pollutionCost = pollutionCost;
    }

    public StationNode getFromStation() {
        return fromStation;
    }

    public StationNode getToStation() {
        return toStation;
    }

    public TravelType getTravelType() {
        return travelType;
    }

    public double getTimeCost() {
        return timeCost;
    }

    public double getPollutionCost() {
        return pollutionCost;
    }

    public double getCost(CostType costType) {
        switch (costType) {
            case TIME:
                return timeCost;
            case CARBON:
                return pollutionCost;
            default:
                throw new IllegalArgumentException("Unknown cost type");
        }
    }

    @Override
    public String toString() {
        return fromStation + " -> " + toStation +
                " | " + travelType +
                " | time: " + timeCost + " min" +
                " | pollution: " + pollutionCost;
    }
}