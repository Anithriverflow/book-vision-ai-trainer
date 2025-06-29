import { NextRequest, NextResponse } from "next/server";
import { falInstance } from "@/lib/fal-config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json(
        { error: "Missing requestId parameter" },
        { status: 400 }
      );
    }

    // Check the training status with fal.ai queue
    try {
      const status = await falInstance.queue.status(
        "fal-ai/flux-lora-fast-training",
        {
          requestId: requestId,
          logs: true,
        }
      );

      let newStatus = "training";

      // Update status based on fal.ai response
      if (status.status === "COMPLETED") {
        newStatus = "completed";
        // Get the result to extract the actual model and lora IDs
        try {
          const result = await falInstance.queue.result(
            "fal-ai/flux-lora-fast-training",
            {
              requestId: requestId,
            }
          );

          return NextResponse.json({
            status: newStatus,
            falStatus: status.status,
            logs: "logs" in status ? status.logs : [],
            result: {
              modelId: result.data.diffusers_lora_file?.url || requestId,
              loraId: result.data.diffusers_lora_file?.url || requestId,
            },
          });
        } catch (resultError) {
          console.error("Error getting training result:", resultError);
          return NextResponse.json({
            status: newStatus,
            falStatus: status.status,
            logs: "logs" in status ? status.logs : [],
            error: "Could not get training result",
          });
        }
      } else if (
        status.status === "IN_PROGRESS" ||
        status.status === "IN_QUEUE"
      ) {
        newStatus = "training";
      }

      return NextResponse.json({
        status: newStatus,
        falStatus: status.status,
        logs: "logs" in status ? status.logs : [],
      });
    } catch (error) {
      console.error("Error checking training status:", error);
      return NextResponse.json(
        {
          error: "Could not check with fal.ai",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Training status check error:", error);
    return NextResponse.json(
      { error: "Failed to check training status" },
      { status: 500 }
    );
  }
}
