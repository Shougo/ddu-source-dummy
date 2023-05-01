import {
  BaseSource,
  Item,
} from "https://deno.land/x/ddu_vim@v2.4.0/types.ts";
import { Denops } from "https://deno.land/x/ddu_vim@v2.4.0/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.3.2/file.ts";

type Params = {
  word: string;
  display: string;
}

export class Source extends BaseSource<Params> {
  override gather(args: {
    denops: Denops;
    sourceParams: Params;
  }): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      start(controller) {
        controller.enqueue([{
          word: args.sourceParams.word,
          display: args.sourceParams.display,
        }]);

        controller.close();
      },
    });
  }

  override params(): Params {
    return {
      word: "",
      display: "",
    };
  }
}
