package com.optimetro.service;

import org.springframework.stereotype.Service;

@Service
public class RouteService {

    public String findRoute(String from, String to) {
        return "Route from " + from + " to " + to;
    }
}