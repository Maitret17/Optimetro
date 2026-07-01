package com.optimetro.controller; 
import org.springframework.web.bind.annotation.GetMapping; 
import org.springframework.web.bind.annotation.RequestMapping; 
import org.springframework.web.bind.annotation.RestController; 
import com.optimetro.service.AlerteService; 

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class AlerteController {
    private final AlerteService alerteService; 
    public AlerteController(AlerteService alerteService){ 
        this.alerteService=alerteService; 
    } 
    
    @GetMapping("/alertes") 
    
    public String getAlertes() throws Exception { 
        return alerteService.getAlertesJson(); 
    } 
}