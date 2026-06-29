package com.optimetro.controller;

import com.optimetro.model.*;
import com.optimetro.service.GraphService;
import com.optimetro.service.RouteService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RouteController {
    private final GraphService graphService;
    private final RouteService routeService;

    public RouteController(GraphService graphService, RouteService routeService) {
        this.graphService = graphService;
        this.routeService = routeService;
    }

    @GetMapping("/stations")
    public Collection<StationNode> getStations() {
        return graphService.getStations();
    }

    @GetMapping("/route")
    public ArrayList<Edge> getRoute(
            @RequestParam int from,
            @RequestParam int to,
            @RequestParam CostType costType
    ) {
        return routeService.findRoute(from, to, costType);
    }
}