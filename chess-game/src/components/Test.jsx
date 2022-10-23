import { useLocation } from 'react-router-dom';

export default function Test() {
    let data = [
        {title: "monitoring", 
         key: "monitoring", 
         icon: "fas fa-map-marked-alt", 
         hideBreadCrumbs: true},

        {title: "logistics", key: "logistics", icon: "fas fa-truck", items: [
                {title: "registry", key: "logistics/registry", icon: "fas fa-truck"},
                {title: "storage",  key: "logistics/storage",  icon: "fas fa-warehouse"},
            ]
        },

        {title: "reports", key: "reports", icon: "fas fa-file-alt", items: [
                {title: "report", key: "reports/report", icon: "fas fa-file-alt"},
                {title: "dashboard",  key: "reports/dashboard",  icon: "fas fa-chart-bar"},
            ]
        },

        {title: "fields", key: "fields", icon: "fas fa-draw-polygon", hideBreadCrumbs: true},

        {title: "guide", key: "guide", icon: "fas fa-book", items: [
                {title: "values", key: "guide/values", icon: "fas fa-coins", items: [
                        {title: "materials",  key: "guide/values/materials",  icon: "fas fa-boxes"},
                        {title: "materialTypes",  key: "guide/values/materialTypes",  icon: "fas fa-boxes"},
                        {title: "measure",  key: "guide/values/measure",  icon: "fas fa-balance-scale-left"},
                    ]
                },
                {title: "transport", key: "guide/transport", icon: "fas fa-truck-monster", items: [
                        {title: "carMachinesGroups",  key: "guide/transport/carMachinesGroups",  icon: "fas fa-indent"},
                        {title: "carMachines",  key: "guide/transport/carMachines",  icon: "fas fa-truck-monster"},
                        {title: "carModels",  key: "guide/transport/carModels",  icon: "fas fa-asterisk"},
                        {title: "carTypes",  key: "guide/transport/carTypes",  icon: "fas fa-asterisk"},
                        {title: "fuelTypes",  key: "guide/transport/fuelTypes",  icon: "fas fa-gas-pump"},
                    ]
                },
                {title: "admin", key: "guide/admin", icon: "fas fa-coffee", items: [
                        {title: "organizations",  key: "guide/admin/organizations",  icon: "fas fa-building"},
                        {title: "branches",  key: "guide/admin/branches",  icon: "fas fa-code-branch"},
                        {title: "users",  key: "guide/admin/users",  icon: "fas fa-user"},
                        {title: "staff",  key: "guide/admin/staff",  icon: "fas fa-user-cog"},
                    ]
                },
                {title: "warehouses",  key: "guide/warehouses",  icon: "fas fa-warehouse", items: [
                        {title: "warehouses",  key: "guide/warehouses/warehouses",  icon: "fas fa-warehouse"},
                        {title: "warehousesGroups",  key: "guide/warehouses/warehousesGroups",  icon: "fas fa-asterisk"},
                    ]
                },
            ]
        },
    ]



let location = useLocation();
let pathNow = location.pathname

if(pathNow && pathNow[0] === '/' && pathNow.length > 1)
    pathNow = pathNow.slice(1, pathNow.length + 1)

pathNow ="guide/warehouses/warehousesGroups"


let splitPath = []

function getKeysArr(keysString, arr) {
    arr.push(keysString)
    let subKeyIndex = keysString.lastIndexOf("/")
    if(subKeyIndex == -1) {
        return arr.reverse();
    } else {
        let subKey = keysString.substring(0, subKeyIndex)
        getKeysArr(subKey, arr)
    }
}

getKeysArr(pathNow, splitPath)

let splittedPathNow = pathNow.split('/').map((pathEl, i, arr) => (
    (arr.filter((pEl, j) => j < i)).join('/') + (i !== 0 ? '/' : '') + pathEl ))

    
let result2 = []

function breadcrumb(array, arrOfKeys, result) {
  array.map((obj) => {
      if(arrOfKeys.length == 0) return;
      arrOfKeys.map((key, i) => {
        if (obj.key === key) {
          result.push(obj)
          arrOfKeys.splice(i, 1)

          if (obj.items) {
            breadcrumb(obj.items, arrOfKeys, result)
          }   
        }
      })
  })
}

 breadcrumb(data, splittedPathNow, result2)
console.log(result2)












}
