package com.optimetro.algorithm;

import com.optimetro.model.Edge;
import com.optimetro.model.Graph;
import com.optimetro.model.StationNode;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class Connectivity {

    public static ConnectivityResult test(Graph graph) {
        Set<StationNode> stations = graph.getStations();

        if (stations.isEmpty()) {
            return new ConnectivityResult(true, 0, 0, new ArrayList<>());
        }

        StationNode start = stations.iterator().next();

        Set<StationNode> visited = new HashSet<>();
        ArrayDeque<StationNode> stack = new ArrayDeque<>();

        stack.push(start);

        while (!stack.isEmpty()) {
            StationNode current = stack.pop();

            if (visited.contains(current)) {
                continue;
            }

            visited.add(current);

            for (Edge edge : graph.getNeighbors(current)) {
                StationNode neighbor = edge.getToStation();

                if (!visited.contains(neighbor)) {
                    stack.push(neighbor);
                }
            }
        }

        ArrayList<StationNode> unreachableStations = new ArrayList<>();

        for (StationNode station : stations) {
            if (!visited.contains(station)) {
                unreachableStations.add(station);
            }
        }

        boolean connected = visited.size() == stations.size();

        return new ConnectivityResult(
                connected,
                stations.size(),
                visited.size(),
                unreachableStations
        );
    }
}