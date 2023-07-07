import path from "path";
import esbuild from "esbuild";
import babel from "esbuild-plugin-babel";

const start = async () => {
  const context = await esbuild.context({
    entryPoints: ["application.js"],
    bundle: true,
    outdir: path.join(process.cwd(), "app/assets/builds"),
    absWorkingDir: path.join(process.cwd(), "app/javascript"),
    plugins: [
      babel({
        config: {
          plugins: [
            [
              "@babel/plugin-proposal-pipeline-operator",
              { topicToken: "^^", proposal: "hack" },
            ],
          ],
        },
      }),
    ],
  });

  await context.watch();
};
start();
