public class StationNode {
    private String id;
    private String name;
    private String line;

    public StationNode(String id, String name, String line) {
        this.id = id;
        this.name = name;
        this.line = line;
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

    @Override
    public String toString() {
        return name + " [" + line + "]";
    }
}