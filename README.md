This is a template of a module for Foundry VTT, based on https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template <br>
It is made works best with VS Code on Windows. <br>
There are tasks configured for VS code, for them to work properly, the .ts files should be placed in /src and everything else in /assets <br>
If watch-run plugin is installed, the files in /src will be automatically compiled and the files in /assets copied into /dist <br>
The included .bat file creates a link to the /dist in the default directory for Foundry modules, allowing to test the module immediately (running it is only required once) <br>
The template uses this for TypeScript types for Foundry https://github.com/League-of-Foundry-Developers/foundry-vtt-types