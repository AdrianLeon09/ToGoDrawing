namespace ToGoDrawing.Application;

public class StrokeDto
{
   public List<PointsDto> Points { get; set; }
   public string Color { get; set; } = "black"; // default

    public StrokeDto(List<PointsDto> points, string color)
    {
        this.Points = points;
        this.Color = color;
    }

    public StrokeDto(){}
}

public class PointsDto
{
    public float x { get; set; }
    public float y { get; set; }
}