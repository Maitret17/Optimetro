package com.optimetro.algorithm;

import com.optimetro.model.CostType;
import com.optimetro.model.Edge;
import com.optimetro.model.Graph;
import com.optimetro.model.StationNode;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;

public class Kruskal {

    public static Graph Acpm(Graph graph, CostType costType) {
        ArrayList<Edge> edges = new ArrayList<>(graph.getEdges());
        edges.sort(Comparator.comparingDouble(edge -> edge.getCost(costType)));

        Graph acpm = new Graph();

        HashMap<StationNode, StationNode> parent = new HashMap<>();

        for (StationNode station : graph.getStations()) {
            parent.put(station, station);
            acpm.addStation(station);
        }

        for (Edge edge : edges) {
            StationNode from = edge.getFromStation();
            StationNode to = edge.getToStation();

            StationNode rootFrom = find(parent, from);
            StationNode rootTo = find(parent, to);

            if (!rootFrom.equals(rootTo)) {
                union(parent, rootFrom, rootTo);

                acpm.addBidirectionalEdge(
                        from,
                        to,
                        edge.getTravelType(),
                        edge.getTimeCost(),
                        edge.getPollutionCost()
                );
            }
        }

        return acpm;
    }

    private static StationNode find(HashMap<StationNode, StationNode> parent, StationNode station) {
        StationNode stationParent = parent.get(station);

        if (!stationParent.equals(station)) {
            StationNode root = find(parent, stationParent);
            parent.put(station, root);
            return root;
        }

        return stationParent;
    }

    private static void union(HashMap<StationNode, StationNode> parent, StationNode stationA, StationNode stationB) {
        StationNode rootA = find(parent, stationA);
        StationNode rootB = find(parent, stationB);

        if (!rootA.equals(rootB)) {
            parent.put(rootB, rootA);
        }
    }
}