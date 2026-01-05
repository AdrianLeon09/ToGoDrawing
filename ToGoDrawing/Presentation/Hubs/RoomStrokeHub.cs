using Microsoft.AspNetCore.SignalR;
using ToGoDrawing.Application;
using ToGoDrawing.Domain;

namespace ToGoDrawing.Presentation.Hubs
{
    public class RoomStrokeHub : Hub
    {
        public async Task SendStrokesServer(string name, List<StrokeDto> strokes, string roomId)
        {
            await Clients.OthersInGroup(roomId).SendAsync("ReceiveStrokes", name, strokes);
        }
        
        public async Task<string> CreateRoom()
        { 
            Guid randomId = Guid.NewGuid();
            await Groups.AddToGroupAsync(Context.ConnectionId, randomId.ToString());
            return randomId.ToString();
        }

        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        }
    }
}
 