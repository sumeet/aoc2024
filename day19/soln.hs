{-# LANGUAGE OverloadedStrings #-}

import Control.Monad.State (MonadState (get), State, runState)
import Data.Map (Map)
import qualified Data.Map as M
import Data.Maybe (fromJust)
import Data.Text (Text, isPrefixOf, pack, splitOn, stripPrefix)
import Data.Text.Array (run)

solve :: [Text] -> Text -> State (Map Text Bool) Bool
solve avail "" = pure True
solve avail target = do
  cache <- get
  case M.lookup target cache of
    Just res -> pure res
    Nothing -> or <$> mapM tryMatch avail
  where
    tryMatch a
      | a `isPrefixOf` target = solve avail (fromJust $ stripPrefix a target)
      | otherwise = pure False

main :: IO ()
main = do
  input <- pack <$> readFile "input.txt"
  let [_avail, _targets] = splitOn "\n\n" input
  let avail = splitOn ", " _avail
  let targets = splitOn "\n" _targets
  putStrLn "part 1:"
  let (results, _) = runState (mapM (solve avail) targets) M.empty
  print $ sum $ map fromEnum results
