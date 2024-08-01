import { BaseSource, type Item } from "jsr:@shougo/ddu-vim@^5.0.0/types";

import { type ActionData } from "jsr:@shougo/ddu-kind-file@^0.8.0";

import type { Denops } from "jsr:@denops/core@^7.0.0";

type Params = {
  word: string;
  display: string;
  hlGroup: string;
};

export class Source extends BaseSource<Params> {
  override gather(args: {
    denops: Denops;
    sourceParams: Params;
  }): ReadableStream<Item<ActionData>[]> {
    const { word, display, hlGroup } = args.sourceParams;

    return new ReadableStream({
      start(controller) {
        controller.enqueue([{
          word,
          display: display !== "" ? display : undefined,
          highlights: [{
            name: "ddu-dummy",
            hl_group: hlGroup,
            col: 1,
            width: byteLength(display || word),
          }],
        }]);

        controller.close();
      },
    });
  }

  override params(): Params {
    return {
      word: "",
      display: "",
      hlGroup: "",
    };
  }
}

const ENCODER = new TextEncoder();
function byteLength(
  str: string,
) {
  return ENCODER.encode(str).length;
}
