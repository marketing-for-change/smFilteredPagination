smFilteredPagination
====================
Version: 0.5
Author: Tyler Mulligan (www.saltermitchell.com)

## Introduction

smFilteredPagination is a jQuery pagination plugin that has been designed
to be more flexible than existing plugins.  All the pagination plugins
I looked into had issues handling items hat they are filtered after
pagination has been initialized.

## Explaination

Typically the reason for this was caused by the way pages were defined,
wrapping predetermined chunks in divs to create pages:

    <div class="page">
        <div class="item"></div>
        <div class="item"></div>
    </div>
    <div class="page hide">
        <div class="item"></div>
        <div class="item"></div>
    </div>
    <div class="page hide">
        <div class="item"></div>
        <div class="item"></div>
    </div>


What makes smFilteredPagination a better alternative is in the way it
handles pages:

    <div class="results">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item hide"></div>
        <div class="item hide filtered"></div>
        <div class="item hide"></div>
        <div class="item hide"></div>
    </div>


The hidden class is used to hide any items outside the currently viewed
"slice".  In addition to the hidden class, you may add a list of classes
that can be used as filters to dynamically filter items from the
pagination.

This plugin has been written OOP style, also giving access to public
methods.


    pagination1 = new $.smFilteredPagination($("#pagination-1"));
    pagination1.setItemsPerPage(5);


smFilteredPagination aims to be a simple, highly configurable and
flexible pagination solution.

Please read the source and check out the demos for more information.

## LIVE EXAMPLE
http://www.dev4.us/jquery-plugins/smFilteredPagination/

## TODO:

- Ajax support
- More public methods
- Default themes
- Remove double jQuery references
