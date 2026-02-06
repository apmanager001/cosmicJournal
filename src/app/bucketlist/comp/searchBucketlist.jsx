"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  fetchBucketlistItems,
  fetchUserBucketListItems,
  addBucketlistItem,
  addToUserBucketlist,
  flagBucketlistItem,
  fetchCategories,
} from "@/comp/utility/tanstack/bucketlistService";
import { Flag, Plus, X, Info } from "lucide-react";
import { toast } from "react-hot-toast";

const SearchBucketlist = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", description: "" });
  const [categories, setCategories] = useState([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["userBucketlist"],
    queryFn: fetchUserBucketListItems,
  });

  useEffect(() => {
    if (!isModalOpen) return;
    const loadCategories = async () => {
      try {
        const result = await fetchCategories();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, [isModalOpen]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      const results = await fetchBucketlistItems(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleAddNewItem = async () => {
    if (!newItem.category || !newItem.title) {
      toast.error("Please select a category before adding the item.", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    try {
      const bucketlistItem = await addBucketlistItem({
        title: newItem.title,
        description: newItem.description,
        category: newItem.category,
      });
      queryClient.invalidateQueries({ queryKey: ["userBucketlist"] });

      setIsModalOpen(false);
      setNewItem({ title: "", description: "", category: "" });
    } catch (error) {
      console.error("Error adding new bucketlist item:", error);
    }
  };

  return (
    <div className="form-control relative max-w-96">
      <label htmlFor="search" className="label mb-3">
        <span className="label-text">Search Bucketlist</span>
        <div
          className="tooltip tooltip-bottom cursor-pointer"
          data-tip="Search and add items to your bucketlist. If you don't see an item, you can add your own!"
        >
          <Info />
        </div>
      </label>
      <div className="relative">
        <input
          type="text"
          id="search"
          placeholder="Type to search..."
          className="input input-bordered input-xl w-full pr-10"
          value={searchTerm}
          onChange={handleSearchChange}
          autoComplete="off"
        />
        {searchTerm != "" ? (
          <button
            className="z-10 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={clearSearch}
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          ""
        )}
      </div>
      <ul
        className={`flex flex-col gap-2 bg-base-100 pt-2 w-full rounded-b-2xl absolute z-10 shadow-lg ${searchTerm ? "border" : ""} border-base-content/40`}
      >
        {searchResults.slice(0, 5).map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center gap-2 "
          >
            <button
              className="btn btn-soft btn-success rounded-full ml-4"
              onClick={async () => {
                try {
                  clearSearch();
                  await addToUserBucketlist(item.id);
                  queryClient.invalidateQueries({
                    queryKey: ["userBucketlist"],
                  });
                } catch (error) {
                  console.error("Error adding to user_bucketlist:", error);
                }
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
            <p className="font-bold truncate flex-grow text-center">
              {item.title}
            </p>
            <div className="dropdown dropdown-end dropdown-hover mr-4">
              <button className="btn btn-error btn-soft rounded-full ">
                <Flag className="w-4 h-4" />
              </button>
              <ul className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
                {["Spam", "Inappropriate", "Other"].map((reason) => (
                  <li
                    key={reason}
                    className="cursor-pointer border-b hover:bg-primary"
                    onClick={async () => {
                      try {
                        clearSearch();
                        await flagBucketlistItem(item.id, reason);
                      } catch (error) {
                        console.error("Error adding flag:", error);
                      }
                    }}
                  >
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
        {searchTerm.trim() !== "" &&
          (data?.length >
          parseInt(
            process.env.NEXT_PUBLIC_FREE_TIER_BUCKET_LIMIT || "0",
            10,
          ) ? (
            <button className="btn btn-lg btn-error text-error-content text-sm cursor-pointer flex justify-center items-center gap-2 shadow-md p-4 mt-2 rounded-b-2xl">
              <Info className="w-6 h-6 mr-2" />
              Bucketlist limit reached. Please upgrade your plan to add more
              items.
            </button>
          ) : (
            <button
              className="btn btn-lg btn-success text-success-content cursor-pointer flex justify-center items-center gap-2 shadow-md p-4 mt-2 rounded-b-2xl"
              onClick={() => {
                setIsModalOpen(true);
                clearSearch();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </button>
          ))}
      </ul>

      {isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="modal modal-open">
            <div className="modal-box min-w-96 p-6 modalContainer">
              <h3 className="font-bold text-2xl mb-4">
                Add New Bucketlist Item
              </h3>
              <div className="fieldset mb-4">
                <label htmlFor="title" className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className="input input-bordered"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                />
              </div>
              <div className="fieldset mb-4">
                <label htmlFor="description" className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  id="description"
                  className="textarea textarea-bordered"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="fieldset mb-4">
                <span className="label-text">Category</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      id={`category-${category.id}`}
                      key={category.id}
                      className={`badge badge-soft cursor-pointer ${
                        newItem.category === category.id ? "badge-primary" : ""
                      }`}
                      onClick={() =>
                        setNewItem({ ...newItem, category: category.id })
                      }
                      data-tip={category.description}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="modal-action flex justify-between">
                <button className="btn btn-primary" onClick={handleAddNewItem}>
                  Add Item
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setIsModalOpen(false)}
            >
              <button>close</button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SearchBucketlist;
