import { AppMeta } from "@zalo-builder/schema";
import { VirtualFile } from "./virtual-file-tree";

export function emitAppConfig(appMeta: AppMeta): VirtualFile {
  const config = {
    app: {
      title: appMeta.name,
      textColor: "black",
      leftButton: "back",
      statusBar: "normal",
      actionBarHidden: false,
      headerColor: appMeta.primaryColor,
    },
    listCSS: [],
    listSyncJS: [],
  };

  return {
    path: "app-config.json",
    content: JSON.stringify(config, null, 2),
  };
}
