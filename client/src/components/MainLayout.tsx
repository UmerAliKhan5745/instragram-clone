import React from 'react'
import { Outlet } from "react-router-dom";
import LeftSidebar from './LeftSidebar';

function MainLayout() {
  return (
    <>
    <div>
      <LeftSidebar/>
    </div>
    <div>
  <Outlet/>
    </div>
    </>
  )
}

export default MainLayout