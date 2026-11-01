---
title: "My First Steps with GitHub Actions"
slug: "my-first-steps-with-github-actions"
date: "2026-11-02"
description: "What real C and Python projects taught me about CI, automation, and the first steps toward DevOps."
banner: "https://images.unsplash.com/photo-1753715613434-9c7cb58876b9?auto=format&fit=crop&w=1600&q=85"
labels: ["GitHub Actions", "CI", "DevOps"]
authors: ["Lluciocc"]
draft: false
---

## From running commands by hand to automating them

I used to think of GitHub Actions as a place to put a few commands after a push. Working on real projects changed that view. A workflow is a way to make the checks I already run locally happen the same way for every change, and to show clearly what passed or failed.

My first useful examples came from C projects at EPITECH. The goal was not to build a huge deployment platform. It was to automate the practical things that could catch a problem before it made its way further into the project.

Most of the project workflows run on pushes and pull requests, with a manual trigger for debugging or rerunning a check. In GitHub Actions, that starts with a small event declaration:

```yaml
on:
  push:
  pull_request:
  workflow_dispatch:
```

The excerpts below are shortened versions of the real jobs. They show the decisions that mattered while I was building them.

## C projects: style, build, and tests

I split the C checks into separate jobs so that each one had a clear responsibility. The coding-style job runs EPITECH's coding-style checker in Docker. Because the project uses a self-hosted runner, the workflow also has to respect the environment provided by EPITECH. I excluded the test directory from that style check so the checker focused on the project sources.

The checker expects an image tagged `latest`, while the available EPITECH image was `devel`. The workflow pulls that image and gives it the expected tag before running the check:

```yaml
- name: Pull coding-style checker
  run: |
    docker pull ghcr.io/epitech/coding-style-checker:devel
    docker tag \
      ghcr.io/epitech/coding-style-checker:devel \
      ghcr.io/epitech/coding-style-checker:latest
```

The rest of the style job copies the repository into a temporary directory, leaves out `.git` and `test/`, mounts the source and report directories into the container, and fails if its report file is non-empty. That last part matters: running a tool is not enough if its findings do not affect the job's exit status.

The build job runs `make` from the repository root and checks that an executable was produced there. That kept the workflow useful across different projects without hard-coding one binary name into the action.

The build itself stays deliberately simple:

```yaml
- name: Build
  run: make

- name: Check for a root executable
  shell: bash
  run: |
    executable="$(find . -maxdepth 1 -type f -executable -print -quit)"
    if [ -z "$executable" ]; then
      echo "::error::No executable generated at the repository root."
      exit 1
    fi
```

In the real workflow, the build runs in EPITECH's Docker image. The important decision was to test the result the assignment asks for instead of checking for one specific executable name.

For tests, I used Criterion through the project's `tests_run` Makefile rule. Some assignments did not have that rule, so the workflow detects whether it exists and skips the Criterion job when it does not. This made the test step helpful without making a missing optional target look like a failed build.

The core of that decision can be expressed like this:

```bash
if ! grep -Eq '^[[:space:]]*tests_run[[:space:]]*:' Makefile; then
  echo "::warning::No tests_run target; skipping Criterion tests."
  exit 0
fi

make tests_run
```

The test target then compiles and runs the Criterion suite. A failing assertion makes the job fail, so the result appears next to the build and style checks in the pull request.

Keeping style, build, and tests separate made failures easier to understand. A red check could point to a formatting issue, a compiler or Makefile problem, or a test that exposed a bug.

## Python projects: lint and build

I also worked on Python workflows. Ruff checks the code for lint issues, while the build job installs the project dependencies and runs its Meson build and install steps. For the GTK application, that meant preparing a Linux environment with Python 3.13 and dependencies such as GTK 4, libadwaita, and PyGObject.

The lint step did more than enforce a style preference. It caught real issues, including a missing comma and unused imports. Seeing those problems in the workflow showed me how CI can give fast feedback on changes that might otherwise be discovered much later.

The lint command itself is short; the reliable part is installing the same Python version and lint tool in CI each time:

```yaml
- name: Install Ruff
  run: python -m pip install ruff

- name: Lint Python files
  run: ruff check .
```

For the GTK application, the build job also installs native development dependencies, then asks Meson to configure, compile, and install the project:

```bash
meson setup build
meson compile -C build
DESTDIR="$RUNNER_TEMP/install" meson install -C build
```

This was useful because a Python application can still depend on system libraries. A clean CI environment made missing GTK, libadwaita, or PyGObject dependencies visible instead of relying on packages already installed on my laptop.

## Automating my GitHub profile

I also use Actions for my profile README. The [profile workflow](https://github.com/Lluciocc/Lluciocc/blob/main/.github/workflows/snake.yml) runs daily, when I start it manually, and when I change that workflow file. It generates several SVG assets: the animated contribution snake, a streak card, GitHub statistics, and a top-languages card. It uses a `GRAPH_TOKEN` secret to include private contribution data after authorizing the token for SSO, then publishes the files to a `gh-pages` branch for the README to display.

Here is the shortened shape of that workflow:

```yaml
on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate contribution snake
        uses: Platane/snk@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          github_token: ${{ secrets.GRAPH_TOKEN }}
          outputs: |
            dist/github-snake.svg
            dist/github-snake-dark.svg?palette=github-dark

      - name: Restore output permissions
        run: sudo chown -R "$(id -u):$(id -g)" dist

      # Other steps generate the streak, stats, and languages cards.

      - name: Publish profile assets
        uses: crazy-max/ghaction-github-pages@v4
        with:
          build_dir: dist
          target_branch: gh-pages
          jekyll: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This workflow taught me a different CI lesson: generated files have their own permissions and credentials. The snake action initially created root-owned files in `dist/`, which stopped later generators from writing their cards. Restoring ownership before the next steps fixed the pipeline. I also had to distinguish between a missing token, a failed generator, and an SVG that was generated correctly but not published where the README expected it. The trophy card in my README is a separate widget; it is not produced by this asset workflow.

## What I learned from the failures

The most useful part was learning to read a failed workflow as information. Sometimes the code was wrong; sometimes a dependency or runner setup was missing; sometimes the workflow itself made an assumption that did not fit the project. Logs helped me tell those cases apart and fix the right layer.

I also learned that automation should reflect the actual project. A C assignment with Criterion, a project with only a root Makefile, and a GTK application do not need identical jobs. The workflow becomes useful when it checks the commands and requirements people really rely on.

## A first step toward DevOps

These workflows are not a complete DevOps setup, and they do not deploy a production service. They are my first hands-on steps in that direction: describing a build environment, automating quality checks, and making changes easier to verify.

I now understand CI as part of development rather than a separate tool that runs after it. Learning how to keep builds repeatable, diagnose failures, and adapt automation to different projects gives me a solid place to continue exploring DevOps.

> “A good workflow turns the checks I already trust into feedback the whole project can rely on.”
>
> — lluciocc
