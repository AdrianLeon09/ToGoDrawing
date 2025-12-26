namespace ToGoDrawing.Domain
{
    public class DrawingState
    {
        float MoveToX { get; set; } = 0;
        float MoveToY { get; set; } = 0;
        float LineToX { get; set; } = 0;
        float LineToY { get; set; } = 0;
        bool isPersistent { get; set; } = false;
        List<DrawingState> LinesHistory { get; set; } = new List<DrawingState>();


        public DrawingState()
        {
        }

        public List<float[]> SynchronizePositionPoints(float MoveToX, float MoveToY, float LineToX, float LineToY)
        {
            List<float[]> points = new();

            points.Add([this.MoveToX, this.MoveToY, this.LineToX, this.LineToY]);
            
            return points;
        }   
    }
}
