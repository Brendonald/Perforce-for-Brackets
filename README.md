brackets-perforce-ui
====================

Perforce extension for Brackets. 

Scope and limitations
=====================

This plugin will only do something on files that live in your Perforce Client Root path.
If you make a modification on one of these files, you will get a popup dialog asking you to select a changelist to check the file out.

If you decide not to check the file out, this dialog will not appear again until you save the file and make a new modification (it relies on the file's isDirty flag).

Installation
============

To try out this extension, download these files into a folder on your machine.
In Brackets, go to the Help menu, and "Show Extensions Folder".

Move the folder containing the files to this extensions folder.

You will then need to reload Brackets: menu Debug, then "Reload with Extensions" - or just hit F5.

Issues
======

It is possible that this plugin fails to initialize.
If nothing happens when you modify a file that is in your Perforce Client Root, that means the plugin failed to retrieve the information using the "p4 info" command.
This is most likely due to NodeJS not being able to execute this command, and you will want to make sure that you can successfully run this command yourself from a terminal, and that the p4 command is also executable by NodeJS.
