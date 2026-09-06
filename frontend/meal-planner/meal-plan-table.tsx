"use client"

// Example data

// interface MealplanProps {

//   mealPlans?: MealPlan[];

// }

// let mealplans = defaultMealPlans

// export default MealPlanTablea;

import React, { useEffect, useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  ButtonGroup,
} from "@mui/material"

interface MealPlan {
  mealplankey: string

  idmealPlanWeek: number

  data: {
    daysOfWeek: {
      [key: string]: {
        lunch: string

        supper: string

        breakfast: string

        evening_break: string

        morning_break: string
      }
    }
  }
}

const defaultMealPlans: MealPlan[] = [
  {
    mealplankey: "week2",

    idmealPlanWeek: 2,

    data: {
      daysOfWeek: {
        Friday: {
          lunch: "Mayai",

          supper: "Ugali",

          breakfast: "tea",

          evening_break: "Yogurt",

          morning_break: "Fruit avocado",
        },

        Monday: {
          lunch: "Chicken salad",

          supper: "Grilled fish",

          breakfast: "Bellies",

          evening_break: "Yogurt",

          morning_break: "Fruit",
        },

        Sunday: {
          lunch: "Chicken salad",

          supper: "Grilled fish",

          breakfast: "Biscuits",

          evening_break: "Yogurt",

          morning_break: "Fruit",
        },

        Tuesday: {
          lunch: "mashed potatoes",

          supper: "Githeri avocado",

          breakfast: "maji",

          evening_break: "coffee",

          morning_break: "chocolate",
        },

        Saturday: {
          lunch: "Chicken salad",

          supper: "Grilled fish",

          breakfast: "Eggs and toast",

          evening_break: "Yogurt",

          morning_break: "Fruit",
        },

        Thursday: {
          lunch: "pizza",

          supper: "fruits and greens",

          breakfast: "cocoa",

          evening_break: "coffee",

          morning_break: "juice cola",
        },

        Wednesday: {
          lunch: "ugali",

          supper: "minji rice",

          breakfast: "chapo chai",

          evening_break: "cocoa",

          morning_break: "loaf coffee",
        },
      },
    },
  },

  {
    mealplankey: "week3",

    idmealPlanWeek: 2,

    data: {
      daysOfWeek: {
        Friday: {
          lunch: "Chicken salad",

          supper: "Grilled fish",

          breakfast: "Eggs and toast",

          evening_break: "Yogurt",

          morning_break: "Fruit",
        },

        Monday: {
          lunch: "Chicken salad",

          supper: "Grilled fish",

          breakfast: "Biscuits",

          evening_break: "Yogurt",

          morning_break: "Fruit",
        },

        Sunday: {
          lunch: "Chicken salad",

          supper: "Grilled fish",

          breakfast: "Biscuits",

          evening_break: "Yogurt",

          morning_break: "Fruit",
        },

        Tuesday: {
          lunch: "mashed potatoes",

          supper: "Githeri avocado",

          breakfast: "maji",

          evening_break: "coffee",

          morning_break: "chocolate",
        },

        Saturday: {
          lunch: "Chicken salad",

          supper: "Grilled fish",

          breakfast: "Eggs and toast",

          evening_break: "Yogurt",

          morning_break: "Fruit",
        },

        Thursday: {
          lunch: "pizza",

          supper: "fruits and greens",

          breakfast: "cocoa",

          evening_break: "coffee",

          morning_break: "juice cola",
        },

        Wednesday: {
          lunch: "ugali",

          supper: "minji rice",

          breakfast: "chapo chai",

          evening_break: "cocoa",

          morning_break: "loaf coffee",
        },
      },
    },
  },
]

function MealPlanTablea({ mealPlans }: { mealPlans: MealPlan[] }) {
  const [currentMealPlanKey, setCurrentMealPlanKey] =
    useState<string | undefined>()

  useEffect(() => {
    if (
      mealPlans.length >
      0
    ) {
      setCurrentMealPlanKey(mealPlans[0].mealplankey)
    }
  }, [mealPlans])

  const handleToggle = (key: string) => {
    console.log("key", key)

    setCurrentMealPlanKey(key)
  }

  const currentMealPlan = mealPlans.find(
    (mealPlan) =>
      mealPlan.mealplankey ===
      currentMealPlanKey,
  )

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

  return (
    <div className="mt-5 p-20">
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        {mealPlans.map((mealPlan) => (
          <Button
            key={mealPlan.mealplankey}
            onClick={() => handleToggle(mealPlan.mealplankey)}
          >
            {mealPlan.mealplankey}
          </Button>
        ))}
      </ButtonGroup>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Breakfast</TableCell>
              <TableCell>Morning Break</TableCell>
              <TableCell>Lunch</TableCell>
              <TableCell>Evening Break</TableCell>
              <TableCell>Supper</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {daysOfWeek.map((day) => {
              const mealPlan = currentMealPlan?.data.daysOfWeek[day]

              return (
                <TableRow key={day}>
                  <TableCell>{day}</TableCell>
                  <TableCell>{mealPlan ? mealPlan.breakfast : "-"}</TableCell>
                  <TableCell>
                    {mealPlan ? mealPlan.morning_break : "-"}
                  </TableCell>
                  <TableCell>{mealPlan ? mealPlan.lunch : "-"}</TableCell>
                  <TableCell>
                    {mealPlan ? mealPlan.evening_break : "-"}
                  </TableCell>
                  <TableCell>{mealPlan ? mealPlan.supper : "-"}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

const page = () => {
  return <MealPlanTablea mealPlans={defaultMealPlans} />
}

export default page
