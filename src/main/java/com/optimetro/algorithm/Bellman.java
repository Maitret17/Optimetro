package com.optimetro.algorithm;

import com.optimetro.model.*;

import java.util.*;

public class Bellman{

    public static List<StationNode> shortestPath(Graph graph, StationNode startStation, StationNode endStation, CostType costType) {

        Map<StationNode, Double> distance = new HashMap<>();
        Map<StationNode, StationNode> predecessor = new HashMap<>();


        for (StationNode station : graph.getStations()) {
            distance.put(station, Double.POSITIVE_INFINITY);
        }

        distance.put(startStation, 0.0);
        int n = graph.getStations().size();

        for (int i = 0; i < n - 1; i++) {
            boolean updated = false;

            for (Edge edge : graph.getEdges()) {

                StationNode u = edge.getFromStation();
                StationNode v = edge.getToStation();

                double weight = edge.getCost(costType);

                if (distance.get(u) != Double.POSITIVE_INFINITY &&
                        distance.get(u) + weight < distance.get(v)) {

                    distance.put(v, distance.get(u) + weight);
                    predecessor.put(v, u);
                    updated = true;
                }
            }

            if (!updated) {
                break;
            }
        }


        for (Edge edge : graph.getEdges()) {

            StationNode u = edge.getFromStation();
            StationNode v = edge.getToStation();

            if (distance.get(u) != Double.POSITIVE_INFINITY &&
                    distance.get(u) + edge.getCost(costType) < distance.get(v)) {

                throw new IllegalStateException("The graph contains a negative-weight cycle.");
            }
        }
        if (distance.get(endStation) == Double.POSITIVE_INFINITY) {
            return Collections.emptyList();
        }

        LinkedList<StationNode> path = new LinkedList<>();

        for (StationNode at = endStation; at != null; at = predecessor.get(at)) {
            path.addFirst(at);
        }

        return path;
    }
}