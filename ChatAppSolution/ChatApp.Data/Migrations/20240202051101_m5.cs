using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Data.Migrations
{
    /// <inheritdoc />
    public partial class m5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasTakenAction",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "RequestType",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestType",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                name: "HasTakenAction",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
