namespace ToGoDrawing.Domain;

public class Stroke
{
   private  List<Points> Points { get; set; }
   private  string Color { get; set; } = "black"; // default

     public Stroke(List<Points> points, string color)
     {
         this.Points = points;
         this.Color = color;
     }
}

public class Points
{
    public float X { get; set; }
    public float Y { get; set; }
}