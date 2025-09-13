"use client";
import React, { useState } from "react";
import {
  fetchBucketlistItems,
  addBucketlistItem,
  addToUserBucketlist,
  flagBucketlistItem,
} from "@/comp/utility/tanstack/bucketlistService";
import { Flag, Plus, X } from "lucide-react";

const SearchBucketlist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", description: "" });

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
    const bucketlistItem = await addBucketlistItem({
      title: newItem.title,
      description: newItem.description,
      created_by: "current_user_id", // Replace with actual user ID
      is_global: false,
      is_public: false,
    });

    // Simulate adding to user_bucketlist
    console.log("Adding to user_bucketlist:", {
      user: "current_user_id", // Replace with actual user ID
      item: bucketlistItem.id,
      notes: "",
      completed: false,
    });

    setIsModalOpen(false);
    setNewItem({ title: "", description: "" });
  };
  //   console.log("Search Results:", searchResults); // Debugging log
  return (
    <div className="form-control relative">
      <label htmlFor="search" className="label">
        <span className="label-text">Search Bucketlist</span>
      </label>
      <div className="relative">
        <input
          type="text"
          id="search"
          placeholder="Type to search..."
          className="input input-bordered w-full pr-10"
          value={searchTerm}
          onChange={handleSearchChange}
          autoComplete="off"
        />
        {searchTerm && (
          <button
            className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={clearSearch}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <ul className="bg-base-100 w-full rounded-box mt-2 absolute z-10 shadow-lg">
        {searchResults.slice(0, 5).map((item) => (
          <li
            key={item.id}
            className="flex justify-around items-center gap-2"
          >
            <button
              className="btn btn-soft btn-success rounded-full"
              onClick={async () => {
                try {
                  await addToUserBucketlist(item.id); // Replace with actual user ID
                } catch (error) {
                  console.error("Error adding to user_bucketlist:", error);
                }
              }}
            >
              <Plus className="w-4 h-4 text-green-500" />
            </button>
            <p className="font-bold">{item.title}</p>
            <div className="dropdown dropdown-hover">
              <button className="btn btn-error btn-soft rounded-full">
                <Flag className="w-4 h-4 text-red-500" />
              </button>
              <ul className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
                {["Spam", "Inappropriate", "Other"].map((reason) => (
                  <li
                    key={reason}
                    className="cursor-pointer border-b"
                    onClick={async () => {
                      try {
                        await flagBucketlistItem(
                          item.id,
                          reason
                        ); // Replace with actual user ID
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
        {searchTerm.trim() !== "" && (
          <li
            className="bg-success-content text-success cursor-pointer flex justify-center items-center gap-2  shadow-md p-4 mt-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </li>
        )}
      </ul>

      {isModalOpen && (
        <div className="modal modal-open flex items-center justify-center">
          <div className="modal-box w-96 p-6">
            <h3 className="font-bold text-2xl mb-4">Add New Bucketlist Item</h3>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newItem.title}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              ></textarea>
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
        </div>
      )}
    </div>
  );
};

export default SearchBucketlist;
