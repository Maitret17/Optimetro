package com.optimetro.algorithm;

import com.optimetro.model.StationNode;

import java.util.ArrayList;

public class ConnectivityResult {
    private final boolean connected;
    private final int totalStations;
    private final int visitedStations;
    private final ArrayList<StationNode> unreachableStations;

    public ConnectivityResult(
            boolean connected,
            int totalStations,
            int visitedStations,
            ArrayList<StationNode> unreachableStations
    ) {
        this.connected = connected;
        this.totalStations = totalStations;
        this.visitedStations = visitedStations;
        this.unreachableStations = unreachableStations;
    }

    public boolean isConnected() {
        return connected;
    }

    public int getTotalStations() {
        return totalStations;
    }

    public int getVisitedStations() {
        return visitedStations;
    }

    public ArrayList<StationNode> getUnreachableStations() {
        return unreachableStations;
    }
}