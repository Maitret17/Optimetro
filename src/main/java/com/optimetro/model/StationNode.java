package com.optimetro.model;

public class StationNode {
    private String id;
    private String name;
    private String line;
    private Double latitude;
    private Double longitude;
    private int groupId; // For later usage on dijkstra

    public StationNode(String id, String name, String line, int groupId, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.line = line;
        this.groupId = groupId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLine() {
        return line;
    }

    public Double getLatitude() { return latitude; }

    public Double getLongitude() { return longitude; }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (!(obj instanceof StationNode)) {
            return false;
        }

        StationNode other = (StationNode) obj;
        return this.id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return name + " [" + line + "]";
    }

    public void setGroupId(int groupId) {
        this.groupId =groupId;
    }
    public int getGroupId() {
        return groupId;
    }
}