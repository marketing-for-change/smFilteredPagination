smFilteredPagination
====================
Version: 0.6
Author: Tyler Mulligan (www.saltermitchell.com)

## Introduction

smFilteredPagination is a jQuery pagination plugin that has been designed
to be more flexible than existing plugins by using counts instead of
wrappers to define pages.  This allows for items to be filtered
dynamically without changing the number of results per page.

## Explaination

Consider the design pattern that uses wrappers around items to define
pages, where results are then filtered.  It can get quite hairy very
quickly as the counts per page will be incosistent and confusing to
the end-user.  This example would be on page 2, showing 1 item.

    <div class="page hide">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
    </div>
    <div class="page">
        <div class="item filtered"></div>
        <div class="item"></div>
        <div class="item filtered"></div>
    </div>
    <div class="page hide">
        <div class="item filtered"></div>
        <div class="item"></div>
        <div class="item"></div>
    </div>


What makes smFilteredPagination a better alternative is in the way it
handles pages, using calculations based on classes.  Consider the same
example as above without the pages.  This example would be on page 2
showing 3 items, 2 of which came from page 3.

    <div class="results">
        <div class="item hide"></div>
        <div class="item hide"></div>
        <div class="item hide"></div>
        <div class="item filtered hide"></div>
        <div class="item"></div>
        <div class="item filtered hide"></div>
        <div class="item filtered hide"></div>
        <div class="item"></div>
        <div class="item"></div>
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
flexible javascript pagination solution.

Please read the source and check out the demos for more information.

## LIVE EXAMPLE
http://www.dev4.us/jquery-plugins/smFilteredPagination/

## TODO:

- More public methods (getCurrentPageItemTop, getCurrentPageItemBottom, getItemCount, getFilteredCount)
- Default themes
- More simple examples
- Stand-alone examples
