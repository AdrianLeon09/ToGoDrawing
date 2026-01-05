using ToGoDrawing.Components;
using ToGoDrawing.Presentation.Hubs;

namespace ToGoDrawing
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddRazorComponents()
                .AddInteractiveServerComponents();
            
            builder.Services.AddSignalR(options =>
            {
                options.MaximumReceiveMessageSize = 2024 * 2024; // 1MB en lugar de 32KB
            });
            
            var app = builder.Build();
            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseAntiforgery();
            app.MapStaticAssets();
            app.MapRazorComponents<App>()
                .AddInteractiveServerRenderMode();
            app.MapHub<RoomStrokeHub>("/SendStrokesServer");
            app.Run();
        }
    }
}
