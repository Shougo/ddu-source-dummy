import type { Item } from "@shougo/ddu-vim/types";
import { BaseSource } from "@shougo/ddu-vim/source";

import type { ActionData } from "@shougo/ddu-kind-file";

import type { Denops } from "@denops/std";

type Params = {
  word: string;
  display: string;
  hlGroup: string;
};

const ENCODER = new TextEncoder();

export class Source extends BaseSource<Params> {
  override gather(args: {
    denops: Denops;
    sourceParams: Params;
  }): ReadableStream<Item<ActionData>[]> {
    const { word, display, hlGroup } = args.sourceParams;
    const hasDisplay = display !== "";
    const hasHlGroup = hlGroup !== "";
    const text = hasDisplay ? display : word;

    return new ReadableStream({
      start(controller) {
        controller.enqueue([{
          word,
          display: hasDisplay ? display : undefined,
          highlights: hasHlGroup
            ? [{
              name: "ddu-dummy",
              hl_group: hlGroup,
              col: 1,
              width: byteLength(text),
            }]
            : undefined,
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

function byteLength(str: string): number {
  return ENCODER.encode(str).length;
}
