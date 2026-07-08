package com.optimetro.service;

import com.optimetro.algorithm.Kruskal;
import com.optimetro.model.*;
import org.springframework.stereotype.Service;
import com.optimetro.algorithm.Connectivity;
import com.optimetro.algorithm.ConnectivityResult;


// For the csv
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import java.util.Collection;
import java.util.HashMap;

@Service
public class GraphService {
    private final Graph graph;
    private final HashMap<String, StationNode> stationsById;

    public GraphService() throws IOException {
        this.graph = new Graph();
        this.stationsById = new HashMap<>();
        loadCsvGraph();
        Kruskal.Acpm(this.graph,CostType.CARBON).exportToCsv();

    }

    public Graph getGraph() {
        return graph;
    }

    public Collection<StationNode> getStations() {
        return stationsById.values();
    }

    public StationNode getStationById(String id) {
        return stationsById.get(id);
    }

    private void addStation(StationNode station) {
        stationsById.put(station.getId(), station);
        graph.addStation(station);
    }

    private void addBidirectionalEdge(StationNode stationA, StationNode stationB, TravelType travelType, double timeCost, double pollutionCost) {
        graph.addBidirectionalEdge(stationA, stationB, travelType, timeCost, pollutionCost);
    }

    private void loadCsvGraph() {
        loadStationsFromCsv();
        loadEdgesFromCsv();
    }

    private void loadStationsFromCsv() {
        try {
            InputStream inputStream = getClass()
                    .getClassLoader()
                    .getResourceAsStream("data/station_node.csv");

            if (inputStream == null) {
                throw new RuntimeException("station_node.csv not found");
            }

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream, StandardCharsets.UTF_8)
            );

            reader.readLine(); // skip header

            String line;
            int groupId = 1;

            while ((line = reader.readLine()) != null) {
                String[] columns = line.split(",", -1);

                String stopId = columns[0];
                String stopName = columns[2];
                String routeName = columns[3];

                Double longitude = Double.parseDouble(columns[5]);
                Double latitude = Double.parseDouble(columns[6]);

                if (!stationsById.containsKey(stopId)) {
                    StationNode station = new StationNode(stopId, stopName, routeName, groupId, latitude, longitude);
                    addStation(station);
                    groupId++;
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Error while loading station_node.csv", e);
        }
    }

    private void loadEdgesFromCsv() {
        try {
            InputStream inputStream = getClass()
                    .getClassLoader()
                    .getResourceAsStream("data/edges.csv");

            if (inputStream == null) {
                throw new RuntimeException("edges.csv not found");
            }

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream, StandardCharsets.UTF_8)
            );

            reader.readLine(); // skip header

            String line;

            while ((line = reader.readLine()) != null) {
                String[] columns = line.split(",", -1);

                int routeType = Integer.parseInt(columns[1]);
                String startStationId = columns[2];
                String endStationId = columns[3];
                double durationSeconds = Double.parseDouble(columns[4]);
                double co2 = Double.parseDouble(columns[6]);

                StationNode startStation = stationsById.get(startStationId);
                StationNode endStation = stationsById.get(endStationId);

                if (startStation == null || endStation == null) {
                    continue;
                }

                double durationMinutes = durationSeconds / 60.0;

                TravelType travelType;
                if (routeType == 6) {
                    travelType = TravelType.TRANSFER;
                } else {
                    travelType = TravelType.METRO;
                }

                graph.addEdge(new Edge(
                        startStation,
                        endStation,
                        travelType,
                        durationMinutes,
                        co2
                ));
            }

        } catch (Exception e) {
            throw new RuntimeException("Error while loading edges.csv", e);
        }
    }

    public ConnectivityResult testConnectivity() {
        return Connectivity.test(graph);
    }
}
