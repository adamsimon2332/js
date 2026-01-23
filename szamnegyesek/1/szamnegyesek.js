function tableGame(t) {
  const t1=t[0][0], t2=t[0][1],t3=t[0][2],
        t4=t[1][0], t5=t[1][1],t6=t[1][2],
        t7=t[2][0], t8=t[2][1],t9=t[2][2];
  if (
   t2-t1-t3===0 &&
   t4-t1-t7===0 &&
   t8-t7-t9===0 &&
   t6-t3-t9===0 &&
   t5-t4-t6===0
  )
    return [t1,t3,t7,t9]
  else
    return [-1]
}