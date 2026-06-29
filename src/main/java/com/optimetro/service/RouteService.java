package com.optimetro.service;

import com.optimetro.algorithm.Dijkstra;
import com.optimetro.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class RouteService {
    private final GraphService graphService;

    public RouteService(GraphService graphService) {
        this.graphService = graphService;
    }

    public ArrayList<Edge> findRoute(int fromId, int toId, CostType costType) {
        StationNode from = graphService.getStationById(fromId);
        StationNode to = graphService.getStationById(toId);

        if (from == null || to == null) {
            return new ArrayList<>();
        }

        return Dijkstra.shortestPath(graphService.getGraph(), from, to, costType);
    }
}