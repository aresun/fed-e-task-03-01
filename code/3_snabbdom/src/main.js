import { init } from "snabbdom/build/package/init";
import { h } from "snabbdom/build/package/h";
import { eventListenersModule } from "snabbdom/build/package/modules/eventlisteners";
import { datasetModule } from "snabbdom/build/package/modules/dataset";

import { data } from "./data";

// utils
import _ from "lodash";

// registry modules
let patch = init([eventListenersModule, datasetModule]);

// create initial vnodes of rows
let vnodes_of_rows = [];

let old_content_vnodes_holder = null;

/**
 * helper function
 */
function get_existed_content_vnodes() {
  return _.cloneDeep(old_content_vnodes_holder.children);
}
function update_list_by_children_vnodes(new_children_vnodes) {
  old_content_vnodes_holder = patch(
    old_content_vnodes_holder,
    h("div.list", {}, new_children_vnodes)
  );
}

// define remove handler
function remove_handler(id) {
  const rows_vnodes = get_existed_content_vnodes();

  // find the vnode by id
  const target_vnode = rows_vnodes.find((row_vnode, i, arr) => {
    return +row_vnode.data.dataset.id === id;
  });

  if (target_vnode) {
    let target_index = rows_vnodes.indexOf(target_vnode);
    // delete target vnode
    rows_vnodes.splice(target_index, 1);
    // render
    update_list_by_children_vnodes(rows_vnodes);
  }
}

/**
 * create initial rows
 */
data.forEach((row, i, arr) => {
  const { rank } = row;
  const { title } = row;
  const { description } = row;
  const { id } = row;

  const vnode_rank = h("span.rank", {}, rank);
  const vnode_title = h("span.title", {}, title);
  const vnode_description = h("span.description", {}, description);
  const vnode_remove = h(
    "button.remove",
    {
      on: {
        click: [
          (e, v) => {
            remove_handler(id);
          },
        ],
      },
    },
    `X`
  );
  const vnode_row = h(
    "div.row",
    {
      key: id,
      dataset: {
        id,
      },
    },
    [vnode_rank, vnode_title, vnode_description, vnode_remove]
  );

  // append row
  vnodes_of_rows.push(vnode_row);
});

/**
 * render initial content
 */
let initial_content = h("div.list", {}, vnodes_of_rows);
const content_holder = document.querySelector(".list");
old_content_vnodes_holder = patch(content_holder, initial_content);

/**
 * add events to buttons
 */
// get all buttons dom
const by_rank_btn = document.querySelector(".by-rank");
const by_title_btn = document.querySelector(".by-title");
const by_description_btn = document.querySelector(".by-description");

by_rank_btn.addEventListener("click", function (e) {
  const children_vnodes = get_existed_content_vnodes();

  const sorted_rows_by_rank = children_vnodes.sort((row_a, row_b) => {
    const rank_vnode_a = row_a.children[0];
    const rank_a = +rank_vnode_a.text;
    const rank_vnode_b = row_b.children[0];
    const rank_b = +rank_vnode_b.text;

    return rank_a - rank_b;
  });

  update_list_by_children_vnodes(sorted_rows_by_rank);
});
by_title_btn.addEventListener("click", function (e) {
  const children_vnodes = get_existed_content_vnodes();

  const sorted_rows_by_title_string = children_vnodes.sort((row_a, row_b) => {
    const title_vnode_a = row_a.children[1];
    const title_a = title_vnode_a.text;

    const title_vnode_b = row_b.children[1];
    const title_b = title_vnode_b.text;

    return title_a.localeCompare(title_b);
  });

  update_list_by_children_vnodes(sorted_rows_by_title_string);
});
by_description_btn.addEventListener("click", function (e) {
  const children_vnodes = get_existed_content_vnodes();

  const sorted_rows_by_description_string = children_vnodes.sort((row_a, row_b) => {
    const description_vnode_a = row_a.children[2];
    const description_a = description_vnode_a.text;

    const description_vnode_b = row_b.children[2];
    const description_b = description_vnode_b.text;

    return description_a.localeCompare(description_b);
  });

  update_list_by_children_vnodes(sorted_rows_by_description_string);
});
