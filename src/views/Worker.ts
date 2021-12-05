import Minimax from "../helpers/Minimax";
import MinimaxDropStage from "../helpers/MinimaxDropStage";

const ctx: Worker = self as any;

// Post data to parent thread
// ctx.postMessage({ foo: "foo" });

// Respond to message from parent thread
ctx.addEventListener("message", (event) => {
  let result;
  if (event.data.type == "drop")
    result = MinimaxDropStage.dropMinimax(
      event.data.params[0],
      event.data.params[1],
      event.data.params[2],
      event.data.params[3],
      event.data.params[4]
    );
  if (event.data.type == "move")
    result = Minimax.minimax(
      event.data.params[0],
      event.data.params[1],
      event.data.params[2],
      event.data.params[3],
      event.data.params[4]
    );
  // console.log(event);
  ctx.postMessage(result);
});
