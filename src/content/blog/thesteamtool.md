---
title: "TheSteamTool"
slug: "thesteamtool"
date: "2024-03-15"
description: "A C# tool for legally downloading and managing Steam games without relying on shady websites."
banner: "/profile.png"
labels: ["C#", "Tool"]
authors: ["Lluciocc"]
draft: false
---

## Introduction

For a long time, I used to crack my video games from unreliable websites, always fearing I might install a virus on my first computer. That’s why I started developing **TheSteamTool** with the ambition of creating a simple tool that would allow me to enjoy my games without resorting to piracy.

This project also allowed me to learn a lot, especially around the `C#` language. Why C#? Because I’ve been working with it for almost 3 years on Unity, and I wanted to go further to strengthen my skills. In addition, `C#`, developed by Microsoft, integrates perfectly with Windows.

## Before Launching the Program

1. Make sure you have installed [Steam](https://store.steampowered.com/?l=english).
2. Do not modify the dependencies located in the `/core` folder.
3. A **GitHub token** is required:
   - Create an account or log in on [GitHub](https://github.com/).
   - Generate a token via [this page](https://github.com/settings/personal-access-tokens).
   - Copy/paste the key into `core/github_tokens.txt`.

   > **Warning:** GitHub tokens expire after a certain time and are limited in requests. Don’t abuse them and regenerate a new one if necessary.

4. Launch the program via `TheSteamTool.bat` or `core/TheSteamTool.exe`.

## After Launch

A console window will open and ask you to specify the path to your Steam installation.

> **Important:** This step is crucial for the program to work properly.

Once configured, the setup will start automatically. No further action is required.

## Usage

### Normal Usage

The program will ask you for an **appid**, which corresponds to the game you want to unlock.

- You can find a game’s appid on [SteamDB](https://steamdb.info).
- Wait until the execution finishes.

## Example: Applying a Patch

Below is a simplified and commented snippet showing how the `hid.dll` patch is moved into the Steam folder and how the necessary directories are automatically created.

```csharp
var dllPath = "hid.dll";

// Check if the file exists before moving it
if (await FileExistsAsync(dllPath))
{
    var targetPath = Path.Combine(config.SteamPath, dllPath);

    // Delete the existing version if necessary
    if (await FileExistsAsync(targetPath))
        await DeleteFileAsync(targetPath);

    // Move the patch into the Steam folder
    await MoveFileAsync(dllPath, targetPath);
    Console.WriteLine("[+] Patch applied successfully!");

    // Create required directories if absent
    var depotCache = Path.Combine(config.SteamPath, "config", "depotcache");
    var plugin = Path.Combine(config.SteamPath, "config", "stplug-in");

    Directory.CreateDirectory(depotCache);
    Directory.CreateDirectory(plugin);
}
else
{
    Console.WriteLine("[!] hid.dll not found.");
}
```

## Additional Commands

- `uninstall` — Completely uninstalls the program and its configuration files.
- `list` — Displays the list of games already installed/unlocked.
- `version` — Displays the current version of the program.
- `rm-[id]` — Removes a specific game via its appid, for example `rm-570` for Dota 2.
- `help` — Displays the help message with all available commands.

## Limitations

- **Internet Connection:** The program must be able to access Steam and GitHub servers.
- **No DRM Bypass:** The tool does not allow you to play without a license; it only facilitates legal downloads.
- **Limited GitHub Keys:** If your key reaches its limit, you will need to generate a new one.
- **Windows Only:** Other operating systems are not guaranteed to work.

## Conclusion

TheSteamTool is a personal project that allowed me to learn a lot in C# while addressing a real need: safely downloading and managing my Steam games.

> “Thank you for using TheSteamTool and supporting my development projects!”
>
> — lluciocc
