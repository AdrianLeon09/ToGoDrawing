using Microsoft.AspNetCore.SignalR;
using ToGoDrawing.Application;

namespace ToGoDrawing.Presentation.Hubs
{
    public class StrokesHub : Hub
    {
        public async Task SendStrokesServer(List<StrokeDto> strokes)
        {
            await Clients.Others.SendAsync("ReceiveStrokes", strokes);
        }
    }
}
 