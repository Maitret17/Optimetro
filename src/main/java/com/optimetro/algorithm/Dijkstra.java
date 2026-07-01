package com.optimetro.algorithm;

import com.optimetro.model.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.PriorityQueue;

public class Dijkstra {

    public static ArrayList<Edge> shortestPath(Graph graph, StationNode startStation, StationNode endStation, CostType costType) {
        ArrayList<Edge> path = new ArrayList<>();

        if (!(graph.getStations().contains(startStation) && graph.getStations().contains(endStation))) {
            return path;
        }

        HashMap<StationNode, Double> costTable = new HashMap<>();
        HashMap<StationNode, Edge> fromTable = new HashMap<>();

        for (StationNode station : graph.getStations()) {
            costTable.put(station, Double.POSITIVE_INFINITY);
        }

        costTable.put(startStation, 0.0);

        PriorityQueue<StationDistance> queue = new PriorityQueue<>();
        queue.add(new StationDistance(startStation, 0.0));

        while (!queue.isEmpty()) {
            StationDistance current = queue.poll();
            StationNode currentStation = current.station;

            if (current.distance > costTable.get(currentStation)) {
                continue;
            }

            if (currentStation.equals(endStation)) {
                break;
            }

            for (Edge edge : graph.getNeighbors(currentStation)) {
                StationNode neighbor = edge.getToStation();

                double newCost = costTable.get(currentStation) + edge.getCost(costType);

                if (newCost < costTable.get(neighbor)) {
                    costTable.put(neighbor, newCost);
                    fromTable.put(neighbor, edge);
                    queue.add(new StationDistance(neighbor, newCost));
                }
            }
        }

        StationNode currentStation = endStation;

        while (!currentStation.equals(startStation)) {
            Edge edge = fromTable.get(currentStation);

            if (edge == null) {
                return new ArrayList<>();
            }

            path.add(edge);
            currentStation = edge.getFromStation();
        }

        Collections.reverse(path);
        return path;
    }

    private static class StationDistance implements Comparable<StationDistance> {
        private StationNode station;
        private double distance;

        public StationDistance(StationNode station, double distance) {
            this.station = station;
            this.distance = distance;
        }

        @Override
        public int compareTo(StationDistance other) {
            return Double.compare(this.distance, other.distance);
        }
    }
}